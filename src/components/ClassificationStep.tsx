import React, { useState } from 'react';
import { Button } from './ui/Button';
import type { StockDifference } from '../interfaces';
import { AlertTriangle, PlusCircle } from 'lucide-react';
import RetailerAssignmentModal from './RetailerAssignmentModal';
import AlertModal from './ui/AlertModal';

interface ClassificationStepProps {
  differences: StockDifference[];
  onConfirm: (allocations: any) => void;
}

const ClassificationStep: React.FC<ClassificationStepProps> = ({ differences, onConfirm }) => {
  const [allocations, setAllocations] = useState<Record<string, { farmer: number, retailer: number }>>({});
  const [retailerAssignments, setRetailerAssignments] = useState<Record<string, any>>({});
  const [modalItem, setModalItem] = useState<(StockDifference & { toRetailer: number }) | null>(null);
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });

  const handleAllocationChange = (sku: string, type: 'farmer' | 'retailer', value: string) => {
    const numValue = Math.max(0, parseInt(value, 10) || 0);
    const currentDifference = differences.find(d => d.sku === sku)?.difference || 0;
    const otherAllocation = type === 'farmer' 
        ? (allocations[sku]?.retailer || 0) 
        : (allocations[sku]?.farmer || 0);
    
    const maxAllowed = currentDifference - otherAllocation;
    const finalValue = Math.min(numValue, maxAllowed);

    setAllocations(prev => ({
      ...prev,
      [sku]: {
        ...prev[sku],
        farmer: type === 'farmer' ? finalValue : (prev[sku]?.farmer || 0),
        retailer: type === 'retailer' ? finalValue : (prev[sku]?.retailer || 0),
      }
    }));
  };
  
  const handleRetailerSubmit = (assignments: any) => {
    if (modalItem) {
        setRetailerAssignments(prev => ({ ...prev, [modalItem.sku]: assignments }));
    }
  };

  const isAllocationComplete = differences.every(d => {
    const totalAllocated = (allocations[d.sku]?.farmer || 0) + (allocations[d.sku]?.retailer || 0);
    return totalAllocated === d.difference;
  });

  const isRetailerAssignmentComplete = differences.every(d => {
    const retailerQty = allocations[d.sku]?.retailer || 0;
    return retailerQty > 0 ? !!retailerAssignments[d.sku] : true;
  });

  const handleSubmit = () => {
    if (!isAllocationComplete || !isRetailerAssignmentComplete) {
      setAlert({
          isOpen: true,
          title: "Incomplete Allocation",
          message: "Please ensure all liquidated stock is fully allocated and all retailer assignments are complete."
      });
      return;
    }
    onConfirm({ allocations, retailerAssignments });
  };

  return (
    <>
      <AlertModal {...alert} onClose={() => setAlert({...alert, isOpen: false})} />
      {modalItem && <RetailerAssignmentModal item={modalItem} onClose={() => setModalItem(null)} onSubmit={handleRetailerSubmit} />}
      <div className="mt-6">
       <div className="rounded-lg border bg-background p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Step 2: Classify Liquidation</h2>
        <p className="text-sm text-secondary-foreground mb-6">
          For each product, allocate the liquidated quantity. If allocating to retailers, click the (+) icon to assign quantities to specific retailers.
        </p>
        <div className="max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-secondary">
                <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-right text-danger">To Liquidate</th>
                    <th className="p-2 text-center">To Farmer</th>
                    <th className="p-2 text-center">To Retailer(s)</th>
                    <th className="p-2 text-right">Remaining</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
            {differences.map(d => {
              const allocated = (allocations[d.sku]?.farmer || 0) + (allocations[d.sku]?.retailer || 0);
              const remaining = d.difference - allocated;
              const toRetailer = allocations[d.sku]?.retailer || 0;
              const isAssigned = !!retailerAssignments[d.sku];
              return (
                <tr key={d.sku}>
                  <td className="p-2 font-medium">{d.name}</td>
                  <td className="p-2 text-right font-bold text-danger">{d.difference}</td>
                  <td className="p-2"><input type="number" value={allocations[d.sku]?.farmer || ''} onChange={e => handleAllocationChange(d.sku, 'farmer', e.target.value)} className="w-24 rounded-md border p-2 text-center" /></td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-2">
                      <input type="number" value={toRetailer} onChange={e => handleAllocationChange(d.sku, 'retailer', e.target.value)} className="w-24 rounded-md border p-2 text-center" />
                      {toRetailer > 0 && (
                        <Button variant="ghost" size="icon" onClick={() => setModalItem({ ...d, toRetailer })}>
                          <PlusCircle className={`h-5 w-5 ${isAssigned ? 'text-green-600' : 'text-primary'}`} />
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className={`p-2 text-right font-bold ${remaining === 0 ? 'text-green-600' : 'text-amber-500'}`}>{remaining}</td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
        
        {(!isAllocationComplete || !isRetailerAssignmentComplete) && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-amber-600">
                <AlertTriangle className="h-5 w-5"/>
                <p className="text-sm font-medium">Please allocate all stock and complete retailer assignments.</p>
            </div>
        )}

        <div className="mt-6 flex justify-end border-t pt-4">
          <Button onClick={handleSubmit} disabled={!isAllocationComplete || !isRetailerAssignmentComplete}>Proceed to Validation</Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ClassificationStep;