import React, { useState } from 'react';
import { Button } from './ui/Button';
import type { StockDifference } from '../interfaces';
import { AlertTriangle } from 'lucide-react';

interface ClassificationStepProps {
  differences: StockDifference[];
  onConfirm: (allocations: any) => void;
}

const ClassificationStep: React.FC<ClassificationStepProps> = ({ differences, onConfirm }) => {
  const [allocations, setAllocations] = useState<Record<string, { farmer: number, retailer: number }>>({});

  const handleAllocationChange = (sku: string, type: 'farmer' | 'retailer', value: string) => {
    const numValue = Math.max(0, parseInt(value, 10) || 0);
    const currentDifference = differences.find(d => d.sku === sku)?.difference || 0;
    const currentFarmer = allocations[sku]?.farmer || 0;
    const currentRetailer = allocations[sku]?.retailer || 0;

    let newFarmer = currentFarmer;
    let newRetailer = currentRetailer;

    if (type === 'farmer') {
      newFarmer = Math.min(numValue, currentDifference - currentRetailer);
    } else {
      newRetailer = Math.min(numValue, currentDifference - newFarmer);
    }
    
    setAllocations(prev => ({
      ...prev,
      [sku]: { farmer: newFarmer, retailer: newRetailer }
    }));
  };

  const isAllocationComplete = differences.every(d => {
    const totalAllocated = (allocations[d.sku]?.farmer || 0) + (allocations[d.sku]?.retailer || 0);
    return totalAllocated === d.difference;
  });

  const handleSubmit = () => {
    if (!isAllocationComplete) {
      alert("You must allocate the full difference for every product before proceeding.");
      return;
    }
    onConfirm(allocations);
  };

  return (
    <div className="mt-6">
       <div className="rounded-lg border bg-background p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Step 2: Classify Liquidation</h2>
        <p className="text-sm text-secondary-foreground mb-6">
          For each product, allocate the liquidated quantity between sales to farmers and stock sent to retailers. The "Remaining" must be zero for all items to proceed.
        </p>

        <div className="max-h-[60vh] overflow-y-auto space-y-4">
          {differences.map(d => {
            const allocated = (allocations[d.sku]?.farmer || 0) + (allocations[d.sku]?.retailer || 0);
            const remaining = d.difference - allocated;
            return (
              <div key={d.sku} className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-lg border p-4 items-center">
                <div className="col-span-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-secondary-foreground">To Liquidate: <span className="font-bold text-danger">{d.difference}</span></p>
                </div>
                <div className="col-span-1">
                  <label htmlFor={`farmer-${d.sku}`} className="text-sm font-medium">To Farmer</label>
                  <input id={`farmer-${d.sku}`} type="number" value={allocations[d.sku]?.farmer || ''} onChange={e => handleAllocationChange(d.sku, 'farmer', e.target.value)} className="mt-1 w-full rounded-md border p-2 text-center" />
                </div>
                 <div className="col-span-1">
                  <label htmlFor={`retailer-${d.sku}`} className="text-sm font-medium">To Retailer(s)</label>
                  <input id={`retailer-${d.sku}`} type="number" value={allocations[d.sku]?.retailer || ''} onChange={e => handleAllocationChange(d.sku, 'retailer', e.target.value)} className="mt-1 w-full rounded-md border p-2 text-center" />
                </div>
                 <div className="col-span-1 text-center">
                  <label className="text-sm font-medium">Remaining</label>
                  <p className={`text-xl font-bold ${remaining === 0 ? 'text-green-600' : 'text-amber-500'}`}>{remaining}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {!isAllocationComplete && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-amber-600">
                <AlertTriangle className="h-5 w-5"/>
                <p className="text-sm font-medium">Please allocate all remaining stock before proceeding.</p>
            </div>
        )}

        <div className="mt-6 flex justify-end border-t pt-4">
          <Button onClick={handleSubmit} disabled={!isAllocationComplete}>Proceed to Validation</Button>
        </div>
      </div>
    </div>
  );
};

export default ClassificationStep;