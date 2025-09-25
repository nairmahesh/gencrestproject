import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import type { StockDifference } from '../interfaces';
import { mockRetailers } from '../services/mockData';
import AlertModal from './ui/AlertModal';

interface RetailerAssignmentModalProps {
  onClose: () => void;
  onSubmit: (assignments: any) => void;
  item: StockDifference & { toRetailer: number };
}

const RetailerAssignmentModal: React.FC<RetailerAssignmentModalProps> = ({ onClose, onSubmit, item }) => {
  const [assignments, setAssignments] = useState<Record<string, number | ''>>({});
  const [alert, setAlert] = useState({isOpen: false, title: '', message: ''});
  
  const totalAssigned = Object.values(assignments).reduce((sum, val) => (sum as number) + Number(val || 0), 0);
  const remaining = item.toRetailer - (totalAssigned as number);

  const handleAssignment = (retailerId: string, value: string) => {
    const numValue = Math.max(0, parseInt(value, 10) || 0);
    const otherAssigned = Object.entries(assignments)
        .filter(([id]) => id !== retailerId)
        .reduce((sum, [, val]) => sum + Number(val || 0), 0);
    
    const maxAllowed = item.toRetailer - otherAssigned;

    setAssignments(prev => ({
        ...prev,
        [retailerId]: Math.min(numValue, maxAllowed),
    }));
  };

  const handleSubmit = () => {
    if (remaining > 0) {
        setAlert({isOpen: true, title: "Incomplete Assignment", message: "You must assign the full quantity to retailers before confirming."});
        return;
    }
    onSubmit(assignments);
    onClose();
  };

  return (
    <>
        <AlertModal {...alert} onClose={() => setAlert({...alert, isOpen: false})} />
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-lg rounded-lg bg-background shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold">Assign to Retailers: {item.name}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5"/></Button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                <div className="flex justify-between items-center rounded-lg bg-secondary p-3">
                    <p>Total to Assign:</p>
                    <p className="text-lg font-bold">{item.toRetailer}</p>
                </div>
                <div className="flex justify-between items-center rounded-lg border p-3">
                    <p>Remaining:</p>
                    <p className={`text-lg font-bold ${remaining === 0 ? 'text-green-600' : 'text-amber-500'}`}>{remaining}</p>
                </div>
                {mockRetailers.map(retailer => (
                    <div key={retailer.id} className="grid grid-cols-2 gap-4 items-center">
                        <p className="font-medium">{retailer.name}</p>
                        <input 
                            type="number" 
                            placeholder="Qty"
                            value={assignments[retailer.id] ?? ''}
                            onChange={e => handleAssignment(retailer.id, e.target.value)}
                            className="w-full rounded-md border p-2 text-center" />
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-4 border-t bg-secondary/50 p-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="button" onClick={handleSubmit} disabled={remaining > 0}>Confirm Assignment</Button>
            </div>
        </div>
        </div>
    </>
  );
};

export default RetailerAssignmentModal;