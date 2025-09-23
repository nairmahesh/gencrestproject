// src/api/types.ts

export type Role =
  | "MDO"
  | "TSM"
  | "RBH"
  | "RMM"
  | "ZBH"
  | "HO"
  | "Admin"
  | "Finance"
  | "Sales";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  region?: string;
  territory?: string;
  manager?: string;
  isActive?: boolean;
  lastLogin?: string;
}

export interface PlanActivity {
  type: string;
  target?: number;
  village?: string;
  distributor?: string;
  retailer?: string;
  notes?: string;
}

export interface PlanCreateRequest {
  assignedTo: string;
  period: "daily" | "fortnightly" | "monthly";
  startDate?: string;
  endDate?: string;
  activities: PlanActivity[];
}

export interface ActivityCreateRequest {
  plan?: string;
  type: string;
  category?: string;
  notes?: string;
  outcome?: string;
  customer?: string;
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
    capturedAt?: string;
  };
  proofs?: Array<{ type?: string; url?: string }>;
  executedAt?: string;
}

export interface LiquidationCreateRequest {
  distributor: string;
  retailer?: string;
  mdo?: string;
  productCode: string;
  productName?: string;
  openingStock: number;
  currentStock: number;
  liquidationQty?: number;
  type: "distributor-farmer" | "retailer-farmer" | "adjustment";
  reason?: string;
  evidence?: Array<{ type?: string; url?: string }>;
  asOfDate: string;
}
