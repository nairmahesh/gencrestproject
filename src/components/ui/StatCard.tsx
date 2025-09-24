// src/components/ui/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  period?: string;
  vol?: number;
  value?: number;
  unit?: string;
  isPercentage?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  period,
  vol,
  value,
  unit = 'Kg/Litre',
  isPercentage = false,
}) => {
  return (
    <div className="flex flex-col rounded-lg border bg-background shadow-sm">
      <div className="p-4">
        <h3 className="text-sm font-medium text-secondary-foreground">{title}</h3>
        {period && <p className="text-xs text-secondary-foreground/70">{period}</p>}
      </div>
      <div className="rounded-b-lg bg-secondary p-4">
        {isPercentage ? (
          <p className="text-3xl font-bold">{value}%</p>
        ) : (
          <>
            {vol !== undefined && (
              <p className="text-sm">
                Vol ({unit}): <span className="font-semibold">{vol.toLocaleString()}</span>
              </p>
            )}
            {value !== undefined && (
              <p className="text-sm">
                Value (Rs.Lakhs): <span className="font-semibold">{value.toFixed(2)}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatCard;