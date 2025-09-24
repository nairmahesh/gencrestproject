// types.ts

// ---------------- GENERIC ----------------

export interface ErrorResponse {
  ok: false;
  message: string;
}

// ---------------- AUTH ----------------

export interface AuthLoginRequest {
  email: string;
  password?: string;
}

export interface AuthLoginResponse {
  ok: boolean;
  data: {
    accessToken: string;
    refreshToken:string;
    user: UserResponse;
  };
}

export interface AuthRefreshResponse {
  ok: boolean;
  data: {
    accessToken: string;
  };
}

// ---------------- USERS ----------------

export type UserRole = 'MDO' | 'TSM' | 'RBH' | 'RMM' | 'ZBH' | 'HO' | 'Admin' | 'Finance' | 'Sales';

export interface UserCreateRequest {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  region?: string;
  territory?: string;
  manager?: string;
}

// Often, an update request is a partial of the create request.
export type UserUpdateRequest = Partial<UserCreateRequest>;

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  zone?:string;
  region?: string;
  territory?: string;
  manager?: string;
  isActive: boolean;
  lastLogin?: string; // date-time
}

// ---------------- PLANS ----------------

export interface PlanActivity {
  type?: string;
  target?: number;
  village?: string;
}

export type PlanPeriod = 'daily' | 'fortnightly' | 'monthly';

export interface PlanCreateRequest {
  assignedTo: string;
  period: PlanPeriod;
  activities: PlanActivity[];
}

export interface PlanResponse {
  id: string;
  createdBy: string;
  assignedTo: string;
  period: PlanPeriod;
  activities: PlanActivity[];
  status: string;
}

// ---------------- ACTIVITIES ----------------

export interface ActivityProof {
  type?: string;
  url?: string;
}

export interface ActivityLocation {
  lat?: number;
  lng?: number;
}

export interface ActivityCreateRequest {
  type: string;
  outcome?: string;
  location?: ActivityLocation;
  proofs?: ActivityProof[];
}

export interface ActivityResponse {
  id: string;
  type: string;
  outcome?: string;
  location?: ActivityLocation;
  proofs?: ActivityProof[];
}


// ---------------- LIQUIDATION ----------------

export type LiquidationType = 'distributor-farmer' | 'retailer-farmer' | 'adjustment';

export interface LiquidationCreateRequest {
  distributor: string;
  productCode: string;
  openingStock: number;
  currentStock: number;
  type: LiquidationType;
  asOfDate: string; // date
}

export interface LiquidationResponse {
  id: string;
  distributor: string;
  productCode: string;
  openingStock: number;
  currentStock: number;
  liquidationQty: number;
  status: string;
}


// ---------------- ERP ----------------

export interface ErpProduct {
  code?: string;
  name?: string;
  invoicePrice?: number;
}

export interface ErpDistributor {
  code?: string;
  name?: string;
}

export interface ErpInventorySnapshot {
  externalCustomerId?: string;
  productCode?: string;
  openingStock?: number;
  ytdSales?: number;
  asOfDate?: string; // date
}

export interface ErpPushRequest {
  products?: ErpProduct[];
  distributors?: ErpDistributor[];
  inventorySnapshots?: ErpInventorySnapshot[];
}

export interface ErpIngestResponse {
  ok: boolean;
  jobId: string;
  counts: {
    products: number;
    distributors: number;
    snapshots: number;
  };
}

// ---------------- UPLOADS ----------------

export interface PresignedRequest {
  fileName: string;
  fileType: string;
}

export interface PresignedResponse {
  ok: boolean;
  data: {
    url: string;
    fields: Record<string, any>;
  };
}