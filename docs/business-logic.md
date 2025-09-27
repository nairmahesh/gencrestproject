# Gencrest Activity Tracker - Business Logic Documentation

## 🚨 CRITICAL VALIDATION RULES

### Stock Management Validations
1. **Liquidation ≤ Available Stock**: `liquidation.volume ≤ (openingStock.volume + ytdNetSales.volume)`
2. **No Negative Stock**: All stock values must be ≥ 0
3. **Balance Stock Accuracy**: `balanceStock = openingStock + ytdNetSales - liquidation`
4. **Value Consistency**: If volume > 0, then value must be > 0
5. **Liquidation Rate Limits**: Liquidation % cannot exceed 100%

### Financial Validations
1. **Credit Limit Enforcement**: `orderValue ≤ (creditLimit - outstanding - pending)`
2. **Payment ≤ Outstanding**: Payment amount cannot exceed outstanding balance
3. **Negative Amount Prevention**: All financial values must be positive
4. **Receipt Requirements**: Cash payments >₹500 need receipts
5. **GST/PAN Validation**: Proper format validation for tax numbers

### Travel & Location Validations
1. **Distance Limits**: Daily travel ≤ 110km
2. **Working Hours**: Minimum 9 hours field time
3. **Location Deviation**: >5km from planned location needs approval
4. **Rate Validation**: Travel expense rates (Car: ₹12/km, Bike: ₹5/km)
5. **GPS Accuracy**: Location coordinates within India bounds

### Visit Compliance Validations
1. **Minimum Duration**: Visits must be ≥ 30 minutes
2. **Check-in/out Sequence**: Check-out must be after check-in
3. **Completion Rate**: Target 80%+ visit completion
4. **Proof Requirements**: Photos/signatures for all visits
5. **Objective Completion**: All planned objectives must be addressed

### Performance Validations
1. **Metric Ranges**: All performance metrics 0-100%
2. **Weighted Calculation**: Visit(25%) + Sales(30%) + Liquidation(25%) + Satisfaction(20%)
3. **Achievement Limits**: Cannot exceed 150% of target (data verification needed)
4. **Minimum Performance**: <70% triggers improvement plan
5. **Incentive Eligibility**: Performance thresholds for incentive calculation

## Table of Contents
1. [User Authentication & Role-Based Access Control](#user-authentication--role-based-access-control)
2. [Stock Liquidation Business Logic](#stock-liquidation-business-logic)
3. [Activity Planning & Execution](#activity-planning--execution)
4. [Field Visit Management](#field-visit-management)
5. [Sales Order Processing](#sales-order-processing)
6. [Financial Management](#financial-management)
7. [Performance & Incentive Logic](#performance--incentive-logic)
8. [Mobile App Integration](#mobile-app-integration)
9. [Reporting & Analytics](#reporting--analytics)
10. [Data Validation & Business Rules](#data-validation--business-rules)
11. [Integration Points](#integration-points)
12. [Security & Compliance](#security--compliance)

---

## 1. User Authentication & Role-Based Access Control

### Organizational Hierarchy (10 Levels)
```
Level 8: MD (Managing Director)
Level 7: VP_SM (VP - Sales & Marketing)
Level 6: MH (Marketing Head)
Level 5: ZBH (Zonal Business Head)
Level 4: RMM (Regional Marketing Manager)
Level 3: RBH (Regional Business Head)
Level 2: TSM (Territory Sales Manager)
Level 1: MDO (Market Development Officer)
Level 9: CHRO (Chief HR Officer)
Level 10: CFO (Chief Financial Officer)
```

### Reporting Structure
- **MDO** → **TSM** → **RBH** → **RMM** → **MH** → **VP_SM** → **MD**
- **ZBH** → **VP_SM** → **MD**
- **CHRO** → **MD**
- **CFO** → **MD**

### Permission Matrix
| Role | Field Visits | Sales Orders | Liquidation | Planning | Approvals |
|------|-------------|-------------|-------------|----------|-----------|
| MDO | View, Create, Edit | View, Create, Edit | View, Edit | View Only | None |
| TSM | All + Approve | All + Approve | All + Approve | All + Approve | MDO |
| RBH | All + Approve | All + Approve | All + Approve | All + Approve | MDO, TSM |
| RMM | View, Approve | View, Approve | View, Approve | All + Approve | MDO, TSM, RBH |
| ZBH | View, Approve | View, Approve | View, Approve | View, Approve | All Below |
| MH | View, Approve | View, Approve | View, Approve | View, Approve | RMM |
| VP_SM | View, Approve | View, Approve | View, Approve | View, Approve | ZBH, MH |
| MD | View Only | View Only | View Only | View Only | VP_SM |
| CHRO | View All | View All | View All | View All | None |
| CFO | View All | View All | View All | View All | None |

---

## 2. Stock Liquidation Business Logic

### 🔥 CRITICAL BUSINESS DEFINITION
```
LIQUIDATION = Stock sold to FARMERS ONLY (non-returnable)
Stock sold to retailers ≠ Liquidation (can be returned to distributor)
```

### Core Formulas
```javascript
// Liquidation Percentage
liquidationPercentage = (liquidation / (openingStock + ytdNetSales)) × 100

// Balance Stock
balanceStock = openingStock + ytdNetSales - liquidation

// Value Calculations
value = volume × weightedAverageUnitPrice
```

### Stock Movement Types
1. **Liquidation (Farmer Sales)**
   - Direct sales from distributor to farmer
   - Sales from retailer to farmer (tracked via retailer liquidation)
   - Non-returnable transactions
   - Counts toward liquidation percentage

2. **Retailer Transfers**
   - Stock moved from distributor to retailer
   - Can be returned to distributor
   - Does NOT count as liquidation
   - Requires retailer liquidation tracking

3. **Returns**
   - Only from retailers back to distributors
   - Reduces retailer stock, increases distributor stock
   - Requires approval and documentation

### Multi-Level Tracking Chain
```
Distributor → Retailer → Farmer
     ↓           ↓         ↓
  Transfer   Liquidation  Final
  (Not Liq)  (Counts)    Consumer
```

### Liquidation Verification Requirements
- **Physical stock verification**: Mandatory for balance stock
- **Proof of farmer sales**: Photos, signatures, location stamps
- **Retailer declarations**: Signed statements for retailer liquidations
- **Batch tracking**: Invoice-wise stock movement tracking

---

## 3. Activity Planning & Execution

### Monthly Planning Rules

#### Plan Creation Authority
- **TSM**: Creates plans for MDO team and self
- **RBH/RMM**: Can create plans when TSM absent (auto-approved)
- **ZBH**: Plans approved by VP_SM
- **MH**: Plans approved by VP_SM

#### Activity Categories
1. **Internal Meetings**
   - Team Meetings

2. **Farmer BTL Engagement** (10 types)
   - Farmer Meets – Small
   - Farmer Meets – Large
   - Farm level demos
   - Wall Paintings
   - Jeep Campaigns
   - Field Days
   - Distributor Day Training Program (25 dealers max)
   - Retailer Day Training Program (50 retailers max)
   - Distributor Connect Meeting (Overnight Stay)
   - Dealer/Retailer Store Branding

3. **Channel BTL Engagement**
   - Trade Merchandise

#### Target Setting Logic
- **Visit targets**: Based on territory size and customer count
- **Sales targets**: Historical performance + growth expectations
- **Activity targets**: Minimum activity requirements per category
- **Performance weightage**: Different activities have different impact scores

### Approval Workflows
```javascript
// Monthly Plan Approval Logic
if (submitterRole === 'TSM') {
  approver = 'RBH'; // TSM plans approved by RBH
} else if (submitterRole === 'RBH' || submitterRole === 'RMM') {
  approver = null; // Auto-approved when TSM absent
} else if (submitterRole === 'ZBH' || submitterRole === 'MH') {
  approver = 'VP_SM'; // Approved by VP-Sales & Marketing
}
```

---

## 4. Field Visit Management

### Visit Types & Requirements
- **Planned Visits**: Scheduled in advance with objectives
- **Unplanned Visits**: Emergency or opportunity-based
- **Follow-up Visits**: Based on previous visit outcomes
- **Complaint Visits**: Customer issue resolution
- **Collection Visits**: Payment collection focused

### Location Validation Logic
```javascript
// Location Deviation Rules
const LOCATION_TOLERANCE = 5; // km
const DEVIATION_APPROVAL_REQUIRED = 5; // km

if (actualDistance > LOCATION_TOLERANCE) {
  requireTSMApproval = true;
  captureDeviationReason = true;
}
```

### Visit Compliance Requirements
- **Minimum visit duration**: 30 minutes per visit
- **Mandatory check-in/out**: GPS-based location verification
- **Proof requirements**: Photos, signatures, customer feedback
- **Objective completion**: All planned objectives must be addressed

### Customer Interaction Tracking
- **Customer feedback**: 5-point satisfaction scale
- **Competitor analysis**: Competitor presence and pricing
- **Order generation**: Visit-to-order conversion tracking
- **Payment collection**: Cash/digital payment recording

---

## 5. Sales Order Processing

### Order Lifecycle Management
```
Draft → Pending → Approved → Dispatched → Delivered → Completed
  ↓       ↓         ↓          ↓           ↓          ↓
Create  Review   Authorize  Ship      Receive   Close
```

### Approval Matrix (Order Value Based)
- **< ₹10,000**: MDO can approve
- **₹10,000 - ₹50,000**: TSM approval required
- **₹50,000 - ₹2,00,000**: RBH approval required
- **> ₹2,00,000**: RMM approval required

### Pricing Logic
- **Base pricing**: Product MRP with role-based discount limits
- **Volume discounts**: Quantity-based pricing tiers
- **Seasonal pricing**: Time-based price adjustments
- **Customer-specific pricing**: Negotiated rates for key customers

### Inventory Integration
- **Real-time stock checking**: Prevent overselling
- **Reserved stock**: Hold inventory during order processing
- **Backorder management**: Handle out-of-stock scenarios
- **Substitute products**: Alternative product suggestions

---

## 6. Financial Management

### Credit Management
```javascript
// Credit Limit Validation
availableCredit = creditLimit - outstandingAmount - pendingOrders

if (orderValue > availableCredit) {
  requireCreditApproval = true;
  escalateToRMM = true;
}
```

### Ageing Analysis
- **0-30 days**: Current dues
- **31-60 days**: Watch list
- **61-90 days**: Follow-up required
- **91+ days**: Collection action required

### Payment Processing
- **Multiple modes**: Cash, Cheque, NEFT, UPI, Credit
- **Advance adjustments**: Auto-adjust against future orders
- **Partial payments**: Split payment handling
- **Payment reconciliation**: Bank statement matching

### Travel Expense Logic
```javascript
// Travel Calculation Rules
const RATES = {
  car: 12, // ₹12 per km
  bike: 5,  // ₹5 per km
  public: 0 // Actual receipt amount
};

// Daily Limits
const DAILY_LIMITS = {
  travel: 110, // km
  workingHours: 9, // hours minimum
  maxExpense: 2000 // ₹2000 per day
};
```

---

## 7. Performance & Incentive Logic

### Performance Metrics Calculation
```javascript
// Overall Performance Score
performanceScore = (
  visitCompliance × 0.25 +
  salesAchievement × 0.30 +
  liquidationEfficiency × 0.25 +
  customerSatisfaction × 0.20
) × 100
```

### Incentive Calculation Rules
- **Sales Incentive**: 2% of sales above target
- **Visit Incentive**: ₹100 per visit above target
- **Liquidation Incentive**: ₹50 per % above 50% liquidation
- **Customer Acquisition**: ₹500 per new customer

### Performance Grading
- **A+ (95-100%)**: Exceptional performance
- **A (90-94%)**: Excellent performance
- **B+ (85-89%)**: Good performance
- **B (80-84%)**: Satisfactory performance
- **C+ (75-79%)**: Needs improvement
- **C (70-74%)**: Below expectations
- **D (<70%)**: Performance improvement plan required

---

## 8. Mobile App Integration

### Offline-First Architecture
```javascript
// Sync Priority Queue
const SYNC_PRIORITY = {
  HIGH: ['liquidation_updates', 'farmer_sales', 'visit_checkins'],
  MEDIUM: ['order_creation', 'payment_collection'],
  LOW: ['media_uploads', 'reports']
};
```

### Real-time Synchronization
- **Conflict resolution**: Last-write-wins with manual override
- **Data validation**: Client-side and server-side validation
- **Incremental sync**: Only changed data synchronization
- **Background sync**: Automatic sync when online

### Mobile-Specific Features
- **Camera integration**: Photo/video capture with metadata
- **GPS tracking**: Continuous location monitoring
- **Offline maps**: Cached map data for field areas
- **Voice notes**: Audio recording for quick notes

---

## 9. Reporting & Analytics

### Report Types by Role

#### MDO Reports
- Daily activity summary
- Visit completion report
- Customer interaction log
- Expense summary

#### TSM Reports
- Team performance dashboard
- Territory analysis
- Monthly achievement report
- Exception reports

#### RBH Reports
- Regional performance summary
- TSM comparison analysis
- Market share analysis
- Budget utilization report

#### RMM Reports
- Marketing campaign effectiveness
- Regional comparison
- ROI analysis
- Budget allocation report

### Real-time Analytics
- **Live dashboards**: Auto-refreshing data
- **Trend analysis**: Historical performance trends
- **Predictive analytics**: Forecast based on current trends
- **Exception alerts**: Automated alert generation

---

## 10. Data Validation & Business Rules

### Stock Validation Rules
```javascript
// Critical Validations
const VALIDATION_RULES = {
  // Stock cannot be negative
  stockValidation: (currentStock, reduction) => currentStock >= reduction,
  
  // Liquidation cannot exceed available stock
  liquidationValidation: (liquidation, availableStock) => liquidation <= availableStock,
  
  // Balance stock calculation must be accurate
  balanceValidation: (opening, ytd, liquidation, balance) => 
    Math.abs((opening + ytd - liquidation) - balance) < 0.01,
  
  // Percentage calculation validation
  percentageValidation: (liquidation, total, percentage) =>
    Math.abs((liquidation / total * 100) - percentage) < 1
};
```

### Business Rule Enforcement
- **Working hours**: Minimum 9 hours field time
- **Travel limits**: Maximum 110km per day
- **Visit frequency**: Minimum visits per customer type
- **Documentation**: Mandatory proof for all transactions

### Data Integrity Checks
- **Cross-reference validation**: Ensure data consistency across modules
- **Audit trail maintenance**: Complete transaction history
- **Duplicate prevention**: Prevent duplicate entries
- **Data archival**: Historical data preservation

---

## 11. Integration Points

### ERP System Integration
```javascript
// ERP Sync Points
const ERP_INTEGRATION = {
  // Real-time stock updates
  stockSync: {
    frequency: 'real-time',
    direction: 'bidirectional',
    validation: 'mandatory'
  },
  
  // Invoice processing
  invoiceSync: {
    frequency: 'daily',
    direction: 'from_erp',
    validation: 'automatic'
  },
  
  // Customer master data
  customerSync: {
    frequency: 'weekly',
    direction: 'bidirectional',
    validation: 'manual_review'
  }
};
```

### External Service Integration
- **GPS Services**: Google Maps API for location services
- **Payment Gateways**: Multiple payment processor integration
- **SMS/Email Services**: Automated communication
- **Cloud Storage**: Document and media storage
- **Weather Services**: Weather-based activity planning

### API Design Principles
- **RESTful APIs**: Standard HTTP methods and status codes
- **Authentication**: JWT-based token authentication
- **Rate limiting**: API usage limits and throttling
- **Error handling**: Comprehensive error response structure
- **Versioning**: API version management

---

## 12. Security & Compliance

### Data Security Framework
```javascript
// Security Layers
const SECURITY_FRAMEWORK = {
  // Authentication
  authentication: {
    method: 'JWT_tokens',
    expiry: '24_hours',
    refresh: 'automatic'
  },
  
  // Authorization
  authorization: {
    model: 'role_based_access_control',
    granularity: 'module_action_level',
    inheritance: 'hierarchical'
  },
  
  // Data Protection
  dataProtection: {
    encryption: 'AES_256',
    transmission: 'TLS_1.3',
    storage: 'encrypted_at_rest'
  }
};
```

### Compliance Requirements
- **GST Compliance**: Automated tax calculations and reporting
- **Financial Audit**: Complete audit trail for all transactions
- **Data Privacy**: GDPR-compliant data handling
- **Regulatory Reporting**: Automated compliance reports

### Audit & Monitoring
- **Activity logging**: All user actions logged
- **Performance monitoring**: System performance tracking
- **Security monitoring**: Intrusion detection and prevention
- **Data backup**: Regular automated backups

---

## Business Logic Implementation Guidelines

### 1. Stock Liquidation Implementation
```typescript
interface LiquidationCalculation {
  openingStock: { volume: number; value: number };
  ytdNetSales: { volume: number; value: number };
  liquidation: { volume: number; value: number };
  balanceStock: { volume: number; value: number };
  liquidationPercentage: number;
}

const calculateLiquidation = (
  opening: StockData,
  ytd: StockData,
  liquidation: StockData
): LiquidationCalculation => {
  const totalAvailable = opening.volume + ytd.volume;
  const balance = totalAvailable - liquidation.volume;
  const percentage = (liquidation.volume / totalAvailable) * 100;
  
  return {
    openingStock: opening,
    ytdNetSales: ytd,
    liquidation,
    balanceStock: { volume: balance, value: calculateValue(balance) },
    liquidationPercentage: Math.round(percentage)
  };
};
```

### 2. Approval Workflow Implementation
```typescript
const getApprovalChain = (
  submitterRole: string, 
  requestType: string
): string[] => {
  const reportingChain = getReportingChain(submitterRole);
  
  switch (requestType) {
    case 'monthly_plan':
      if (submitterRole === 'TSM') return ['RBH'];
      if (['RBH', 'RMM'].includes(submitterRole)) return []; // Auto-approved
      return reportingChain.slice(0, 1);
      
    case 'travel_claim':
      return reportingChain.slice(0, 1); // Immediate supervisor
      
    default:
      return reportingChain.slice(0, 1);
  }
};
```

### 3. Performance Calculation Implementation
```typescript
const calculatePerformance = (metrics: PerformanceData): number => {
  const weights = {
    visitCompliance: 0.25,
    salesAchievement: 0.30,
    liquidationEfficiency: 0.25,
    customerSatisfaction: 0.20
  };
  
  return Object.entries(weights).reduce((score, [metric, weight]) => {
    return score + (metrics[metric] * weight);
  }, 0);
};
```

---

## Critical Business Rules Summary

### 🚨 Non-Negotiable Rules
1. **Liquidation Definition**: Only farmer sales count as liquidation
2. **Location Verification**: Mandatory GPS verification for all field activities
3. **Approval Hierarchy**: Strict role-based approval workflows
4. **Data Integrity**: All calculations must be mathematically accurate
5. **Audit Trail**: Complete transaction history for all operations

### 📊 Key Performance Indicators
- **Liquidation Rate**: Target 50% minimum
- **Visit Compliance**: 100% planned visit completion
- **Sales Achievement**: Monthly/quarterly target achievement
- **Customer Satisfaction**: Minimum 4/5 rating
- **Working Hours**: Minimum 9 hours field time daily

### 🔄 Real-time Updates Required
- Stock levels and liquidation percentages
- Visit status and location tracking
- Performance metrics and rankings
- Approval status and workflow progress
- Financial data and credit utilization

---

*Last Updated: January 2024*
*Version: 1.0*
*Document Owner: Development Team*

---

## 🔧 VALIDATION IMPLEMENTATION

### Real-time Validation System
```typescript
// Example: Stock Liquidation Validation
const validateLiquidation = (data: LiquidationData): ValidationResult => {
  const errors: string[] = [];
  const totalAvailable = data.openingStock.volume + data.ytdNetSales.volume;
  
  if (data.liquidation.volume > totalAvailable) {
    errors.push(`Liquidation (${data.liquidation.volume}) cannot exceed available stock (${totalAvailable})`);
  }
  
  return { isValid: errors.length === 0, errors, warnings: [] };
};
```

### Validation Integration Points
1. **Form Submissions**: Validate before saving data
2. **API Calls**: Server-side validation for all operations
3. **Real-time Updates**: Live validation during data entry
4. **Batch Operations**: Validate bulk data operations
5. **Import/Export**: Validate external data integration

### Error Handling Strategy
- **Blocking Errors**: Prevent operation completion
- **Warning Messages**: Allow operation with user confirmation
- **Info Messages**: Provide helpful guidance
- **Audit Logging**: Record all validation failures
- **User Feedback**: Clear, actionable error messages