import React from 'react';
import { motion } from 'framer-motion';
import { PackageOpen, TrendingUp, Droplets, Archive, PieChart, type LucideIcon } from 'lucide-react';

// Defines the structure for our icon and color mapping
interface CardStyle {
  icon: LucideIcon;
  color: string; // Text color for the icon
  bgColor: string; // Background color for the icon container
}

// Map card titles to specific icons and a color scheme
const cardStyleMap: Record<string, CardStyle> = {
  "Opening Stock": { icon: PackageOpen, color: "text-blue-600", bgColor: "bg-blue-100" },
  "YTD Net Sales": { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-100" },
  "Liquidation": { icon: Droplets, color: "text-purple-600", bgColor: "bg-purple-100" },
  "Balance Stock": { icon: Archive, color: "text-slate-600", bgColor: "bg-slate-200" },
  "% Liquidation": { icon: PieChart, color: "text-teal-600", bgColor: "bg-teal-100" },
  "Total Activities YTD": { icon: PackageOpen, color: "text-blue-600", bgColor: "bg-blue-100" },
  "Monthly Activity": { icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-100" },
  "% Monthly Completion": { icon: PieChart, color: "text-teal-600", bgColor: "bg-teal-100" },
};

interface StatCardProps {
  title: string;
  period?: string;
  vol?: number;
  value?: number;
  isPercentage?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, period, vol, value, isPercentage = false }) => {
  const { icon: Icon, color, bgColor } = cardStyleMap[title] || { 
    icon: PackageOpen, 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100' 
  };

  // Determine the main display value and subtitle
  let displayValue = "";
  let subtitle = period || "";
  if (isPercentage) {
    displayValue = `${value}%`;
    subtitle = "Completion Rate";
  } else if (vol !== undefined && value !== undefined) {
    displayValue = vol.toLocaleString();
    subtitle = `Value: ${value.toFixed(2)} Lakhs`;
  } else if (value !== undefined) {
      displayValue = value.toLocaleString();
  }


  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className="bg-card rounded-xl p-4 shadow-sm border border-border"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="font-semibold text-card-foreground">{title}</p>
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{displayValue}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;