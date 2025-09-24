import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchDistributorProducts } from '../store/liquidationSlice';
import { Button } from './ui/Button';
import { LoaderCircle, X } from 'lucide-react';
import type { StockDifference } from '../interfaces';
import AlertModal from './ui/AlertModal';

interface StockEntryModalProps {
  distributorId: string;
  onClose: () => void;
  onSubmit: (differences: StockDifference[]) => void;
}

const StockEntryModal: React.FC<StockEntryModalProps> = ({ distributorId, onClose, onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { distributorProducts, status } = useSelector((state: RootState) => state.liquidation);
  const [stock, setStock] = useState<Record<string, number | ''>>({});
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    if (distributorProducts.length === 0) {
        dispatch(fetchDistributorProducts(distributorId));
    }
  }, [dispatch, distributorId, distributorProducts]);

  const handleStockChange = (sku: string, value: string) => {
    const numValue = value === '' ? '' : parseInt(value, 10);
    if ((isNaN(numValue as number) && value !== '') || Number(numValue) < 0) return;
    setStock(prev => ({ ...prev, [sku]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pendingSkus = distributorProducts.filter(p => stock[p.sku] === undefined || stock[p.sku] === '');
    if (pendingSkus.length > 0) {
      setAlert({
        isOpen: true,
        title: 'Incomplete Entry',
        message: `There are ${pendingSkus.length} product(s) with missing stock values. Please fill all fields to proceed.`
      });
      return;
    }

    const differences: StockDifference[] = distributorProducts.map(p => {
      const currentStock = Number(stock[p.sku]);
      return { sku: p.sku, name: p.name, lastBalance: p.lastBalance, currentStock: currentStock, difference: p.lastBalance - currentStock };
    });
    onSubmit(differences);
  };

  return (
    <>
      <AlertModal {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} />
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl rounded-lg bg-background shadow-2xl flex flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold">Enter Current Stock</h2>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5"/></Button>
          </div>

          {status === 'loading' && <div className="flex justify-center p-12"><LoaderCircle className="h-8 w-8 animate-spin" /></div>}
          
          {status === 'succeeded' && (
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {distributorProducts.map(p => (
                  <div key={p.sku} className="rounded-lg border p-4 grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-1"><p className="font-semibold">{p.name}</p><p className="text-sm text-secondary-foreground">{p.sku}</p></div>
                    <div className="col-span-1 text-center"><label className="text-sm font-medium text-secondary-foreground">Last Balance</label><p className="text-lg font-bold">{p.lastBalance}</p></div>
                    <div className="col-span-1"><label htmlFor={`stock-${p.sku}`} className="text-sm font-medium">Current Stock</label><input id={`stock-${p.sku}`} type="number" placeholder="Enter stock" value={stock[p.sku] ?? ''} onChange={(e) => handleStockChange(p.sku, e.target.value)} className="mt-1 w-full rounded-md border bg-transparent p-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"/></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 border-t bg-secondary/50 p-4">
                  <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                  <Button type="submit">Submit Stock</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default StockEntryModal;