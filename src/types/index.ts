export interface User {
  id: string;
  name: string;
  role: 'MDO' | 'TSM' | 'RBH' | 'RMM' | 'ZH' | 'TMM';
  territory: string;
  state: string;
  region: string;
  zone: string;
  phone: string;
  email: string;
  reportingTo?: string;
  isActive: boolean;
}

export interface Dealer {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  territory: string;
  region: string;
  zone: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  assignedMDO?: string;
  assignedTSM?: string;
  creditLimit: number;
  outstanding: number;
  overdue: number;
  lastOrderDate?: string;
  gstNumber?: string;
  panNumber?: string;
  contactPerson: string;
  email: string;
  businessType: 'Distributor' | 'Dealer' | 'Retailer';
  establishedYear: number;
  annualTurnover: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  subCategory: string;
  brand: string;
  unit: string;
  currentPrice: number;
  mrp: number;
  packSizes: string[];
  hsnCode: string;
  gstRate: number;
  isActive: boolean;
  description: string;
  specifications: Record<string, string>;
}

export interface LiquidationData {
  id: string;
  distributorId: string;
  distributorName: string;
  distributorCode: string;
  openingStock: {
    volume: number;
    value: number;
  };
  ytdNetSales: {
    volume: number;
    value: number;
  };
  liquidation: {
    volume: number;
    value: number;
  };
  balanceStock: {
    volume: number;
    value: number;
  };
  liquidationPercentage: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface LiquidationEntry {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerCode: string;
  dealerType: 'Distributor' | 'Retailer';
  dealerAddress: string;
  dealerPhone: string;
  territory: string;
  region: string;
  zone: string;
  assignedMDO?: string;
  assignedTSM?: string;
  
  // ERP Integration
  erpLastBalance: ProductStock[];
  currentStock: ProductStock[];
  stockVariances: StockVariance[];
  
  // Liquidation Status
  liquidationStatus: 'Pending' | 'In Progress' | 'Completed' | 'Verified';
  lastStockUpdateDate: string;
  lastStockUpdateBy: string;
  
  // Verification
  hasDistributorSignature: boolean;
  hasLetterheadDeclaration: boolean;
  verificationDate?: string;
  
  // Notifications
  pendingTasks: PendingTask[];
  alerts: LiquidationAlert[];
}

export interface ProductStock {
  productId: string;
  productCode: string;
  productName: string;
  skuCode: string;
  skuName: string;
  unit: string;
  lastBalance: number;
  currentStock: number;
  variance: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface StockVariance {
  id: string;
  productId: string;
  skuCode: string;
  varianceQuantity: number;
  varianceType: 'Sold to Retailer' | 'Sold to Farmer' | 'Return from Retailer' | 'Damage' | 'Transfer' | 'Backend_Return_Farmer';
  details: RetailerSale[] | FarmerSale[] | ReturnDetails[];
  verificationRequired: boolean;
  isVerified: boolean;
  verificationDate?: string;
  isBackendEntry?: boolean; // For extreme cases backend entries
}

export interface RetailerSale {
  id: string;
  retailerId: string;
  retailerCode: string;
  retailerName: string;
  retailerPhone: string;
  retailerAddress: string;
  isNewRetailer: boolean;
  skuWiseQuantity: {
    skuCode: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
  }[];
  totalQuantity: number;
  totalValue: number;
  saleDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  paymentMode: 'Cash' | 'Credit' | 'UPI' | 'Cheque';
  invoiceNumber?: string;
  needsLiquidationTracking: boolean;
}

export interface FarmerSale {
  id: string;
  farmerName: string;
  farmerPhone?: string;
  farmerAddress?: string;
  village: string;
  skuWiseQuantity: {
    skuCode: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
  }[];
  totalQuantity: number;
  totalValue: number;
  saleDate: string;
  paymentMode: 'Cash' | 'UPI' | 'Credit';
}

export interface ReturnDetails {
  id: string;
  returnFromType: 'Retailer' | 'Damage' | 'Backend_Farmer'; // Backend_Farmer for extreme cases only
  returnFromId?: string;
  returnFromName: string;
  skuWiseQuantity: {
    skuCode: string;
    quantity: number;
    reason: string;
  }[];
  totalQuantity: number;
  returnDate: string;
  reason: string;
  requiresDeclaration: boolean;
  hasDeclaration: boolean;
  isBackendEntry?: boolean; // Flag for backend entries
  backendEntryBy?: string; // Who made the backend entry
  backendEntryReason?: string; // Reason for backend entry
}

export interface PendingTask {
  id: string;
  type: 'Stock Entry Pending' | 'Retailer Liquidation Tracking' | 'Verification Required' | 'Return Processing' | 'Backend Entry Review';
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  relatedEntityId: string;
  relatedEntityType: 'Product' | 'Retailer' | 'Return';
  requiresBackendApproval?: boolean; // For backend entries
}

export interface LiquidationAlert {
  id: string;
  type: 'Stock Increase Detected' | 'Missing Product Entry' | 'Variance Detected' | 'Verification Overdue' | 'Backend Entry Made';
  message: string;
  severity: 'Error' | 'Warning' | 'Info';
  isRead: boolean;
  createdAt: string;
  relatedData?: any;
  isBackendAlert?: boolean; // For backend entry alerts
}

export interface RetailerLiquidation {
  id: string;
  retailerId: string;
  retailerCode: string;
  retailerName: string;
  distributorId: string;
  distributorName: string;
  
  // Stock assigned by distributor
  assignedStock: {
    productId: string;
    skuCode: string;
    skuName: string;
    assignedQuantity: number;
    assignedDate: string;
    unitPrice: number;
    totalValue: number;
  }[];
  
  // Current stock at retailer
  currentStock: {
    skuCode: string;
    currentQuantity: number;
    lastUpdated: string;
  }[];
  
  // Liquidated to farmers
  farmerLiquidation: {
    skuCode: string;
    liquidatedQuantity: number;
    remainingStock: number;
    liquidationDate: string;
  }[];
  
  // Status tracking
  liquidationStatus: 'Assigned' | 'Partially Liquidated' | 'Fully Liquidated' | 'Stock Returned';
  hasRetailerSignature: boolean;
  lastVisitDate?: string;
  lastVisitBy?: string;
  
  // Return tracking
  returnToDistributor: {
    skuCode: string;
    returnQuantity: number;
    returnDate: string;
    reason: string;
  }[];
  productId: string;
  productName: string;
  productCode: string;
  openingStock: number;
  currentStock: number;
  billingDate: string;
  volume: number;
  grossValue: number;
  netValue: number;
  returns: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  updatedBy: string;
  hasSignature: boolean;
  hasMedia: boolean;
  territory: string;
  region: string;
  zone: string;
  assignedMDO?: string;
  assignedTSM?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  liquidationPercentage: number;
  targetLiquidation: number;
  daysOverdue: number;
  remarks?: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
  salesBreakdown: SalesBreakdown[];
  stockMovements: StockMovement[];
  lastStockCheck?: string;
  stockCheckBy?: string;
  physicalStock?: number;
  stockVariance?: number;
}

export interface SalesBreakdown {
  id: string;
  date: string;
  soldTo: 'Farmer' | 'Retailer';
  buyerName: string;
  buyerCode?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  paymentMode: 'Cash' | 'Credit' | 'UPI' | 'Cheque';
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  invoiceNumber?: string;
  notes?: string;
  verifiedBy: string;
  timestamp: string;
}

export interface StockMovement {
  id: string;
  date: string;
  type: 'Sale' | 'Return' | 'Damage' | 'Transfer' | 'Adjustment';
  quantity: number;
  reason: string;
  reference?: string;
  updatedBy: string;
  timestamp: string;
  beforeStock: number;
  afterStock: number;
}

export interface FieldVisit {
  id: string;
  visitDate: string;
  visitTime: string;
  dealerId: string;
  dealerName: string;
  dealerCode: string;
  visitType: 'Planned' | 'Unplanned' | 'Follow-up' | 'Complaint' | 'Collection';
  purpose: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  checkInTime?: string;
  checkOutTime?: string;
  duration?: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
  media?: string[];
  signature?: string;
  products?: string[];
  nextFollowUp?: string;
  createdBy: string;
  objectives: string[];
  outcomes: string[];
  actionItems: ActionItem[];
  customerFeedback?: CustomerFeedback;
  competitorInfo?: CompetitorInfo[];
  orderValue?: number;
  paymentCollected?: number;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

export interface CustomerFeedback {
  satisfaction: number; // 1-5 scale
  comments: string;
  concerns: string[];
  suggestions: string[];
}

export interface CompetitorInfo {
  competitorName: string;
  products: string[];
  pricing: number;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  dealerId: string;
  dealerName: string;
  dealerCode: string;
  orderDate: string;
  deliveryDate?: string;
  expectedDeliveryDate: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Dispatched' | 'Delivered' | 'Cancelled' | 'Returned';
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  taxAmount: number;
  netAmount: number;
  paymentTerms: string;
  paymentMethod: 'Cash' | 'Credit' | 'Cheque' | 'Online' | 'UPI';
  createdBy: string;
  approvedBy?: string;
  dispatchedBy?: string;
  signature?: string;
  orderForm?: string;
  priority: 'Normal' | 'Urgent' | 'Rush';
  shippingAddress: string;
  billingAddress: string;
  transportMode: 'Road' | 'Rail' | 'Air' | 'Sea';
  vehicleNumber?: string;
  driverDetails?: string;
  trackingNumber?: string;
  invoiceNumber?: string;
  lrNumber?: string;
  remarks?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
  scheme?: string;
  freeQuantity?: number;
  batchNumber?: string;
  expiryDate?: string;
  manufacturingDate?: string;
}

export interface ActivityPlan {
  id: string;
  planType: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'In Progress' | 'Completed' | 'Cancelled';
  approvedBy?: string;
  approvedDate?: string;
  activities: PlannedActivity[];
  targets?: Target[];
  budget?: number;
  actualCost?: number;
  roi?: number;
  kpis: KPI[];
}

export interface PlannedActivity {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  village: string;
  distributor: string;
  distributorCode: string;
  activityType: 'Visit' | 'Demo' | 'Training' | 'Collection' | 'Survey' | 'Promotion';
  description: string;
  expectedOutcome: string;
  actualOutcome?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  proof?: string[];
  participants?: number;
  cost?: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  travelDistance?: number;
  travelTime?: number;
}

export interface Target {
  id: string;
  metric: string;
  targetValue: number;
  achievedValue: number;
  unit: string;
  period: string;
  weightage: number;
  category: 'Sales' | 'Visit' | 'Collection' | 'New Customer' | 'Market Share';
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

export interface TravelClaim {
  id: string;
  claimDate: string;
  fromLocation: string;
  toLocation: string;
  distance: number;
  mode: 'Car' | 'Bike' | 'Public Transport' | 'Flight' | 'Train' | 'Bus';
  amount: number;
  purpose: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Paid';
  receipts?: string[];
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  remarks?: string;
  mileageRate?: number;
  tollCharges?: number;
  parkingCharges?: number;
  otherExpenses?: number;
  advanceAdjusted?: number;
  netPayable?: number;
}

export interface PerformanceMetric {
  id: string;
  employeeId: string;
  period: string;
  metrics: {
    salesAchievement: number;
    visitCompliance: number;
    collectionEfficiency: number;
    newCustomerAcquisition: number;
    marketShare: number;
    customerSatisfaction: number;
  };
  incentives: Incentive[];
  ranking: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  feedback: string;
  improvementAreas: string[];
  strengths: string[];
}

export interface Incentive {
  id: string;
  title: string;
  amount: number;
  status: 'Earned' | 'Pending' | 'Paid' | 'Cancelled';
  period: string;
  criteria: string;
  category: 'Sales' | 'Performance' | 'Special' | 'Bonus';
  earnedDate?: string;
  paidDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

export interface DashboardStats {
  totalVisits: number;
  completedVisits: number;
  pendingVisits: number;
  totalSales: number;
  monthlyTarget: number;
  achievement: number;
  newCustomers: number;
  collections: number;
  pendingOrders: number;
  overduePayments: number;
}

export interface RoutePoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  visitTime?: string;
  status: 'pending' | 'visited' | 'current' | 'skipped';
  estimatedTime?: string;
  actualTime?: string;
  distance?: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  code: string;
  maxAmount: number;
  requiresReceipt: boolean;
  description: string;
}

export interface ComplianceCheck {
  id: string;
  type: 'location' | 'time' | 'signature' | 'photo' | 'form';
  description: string;
  isRequired: boolean;
  status: 'pending' | 'completed' | 'failed';
  completedAt?: string;
  data?: any;
}