import React from 'react';
import { Button } from './ui/Button';
import type { StockDifference } from '../interfaces';

interface LiquidationDetailsProps {
  differences: StockDifference[];
  onConfirm: () => void;
}

const LiquidationDetails: React.FC<LiquidationDetailsProps> = ({ differences, onConfirm }) => {
  const totalLiquidation = differences.reduce((acc, item) => acc + item.difference, 0);

  return (
    <div className="mt-6 rounded-lg border bg-background p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Step 1: Review Stock Differences</h2>
      <p className="text-sm text-secondary-foreground mb-4">
        Based on your stock entry, a total of <span className="font-bold">{totalLiquidation.toLocaleString()}</span> units need to be accounted for. Please confirm the differences below before proceeding.
      </p>

      <div className="max-h-[50vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-secondary">
            <tr>
              <th className="p-2 text-left font-medium">Product</th>
              <th className="p-2 text-right font-medium">Last Balance</th>
              <th className="p-2 text-right font-medium">Current Stock</th>
              <th className="p-2 text-right font-medium text-danger">Difference (To Liquidate)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {differences.map(item => (
              <tr key={item.sku}>
                <td className="p-2 font-medium">{item.name} <span className="text-xs text-secondary-foreground">({item.sku})</span></td>
                <td className="p-2 text-right">{item.lastBalance.toLocaleString()}</td>
                <td className="p-2 text-right">{item.currentStock.toLocaleString()}</td>
                <td className="p-2 text-right font-bold text-danger">{item.difference.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end border-t pt-4">
        <Button onClick={onConfirm}>Confirm Differences & Proceed</Button>
      </div>
    </div>
  );
};

export default LiquidationDetails;