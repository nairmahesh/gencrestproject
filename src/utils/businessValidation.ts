// Business Validation Rules and Logic
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StockData {
  volume: number;
  value: number;
}

export interface LiquidationData {
  openingStock: StockData;
  ytdNetSales: StockData;
  liquidation: StockData;
  balanceStock: StockData;
}

// CRITICAL BUSINESS VALIDATION RULES
export class BusinessValidator {
  
  // 1. STOCK LIQUIDATION VALIDATIONS
  static validateLiquidation(data: LiquidationData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Liquidation cannot exceed available stock
    const totalAvailableStock = data.openingStock.volume + data.ytdNetSales.volume;
    if (data.liquidation.volume > totalAvailableStock) {
      errors.push(`Liquidation (${data.liquidation.volume}) cannot exceed total available stock (${totalAvailableStock})`);
    }

    // Rule 2: Balance stock calculation must be accurate
    const calculatedBalance = data.openingStock.volume + data.ytdNetSales.volume - data.liquidation.volume;
    if (Math.abs(calculatedBalance - data.balanceStock.volume) > 0.01) {
      errors.push(`Balance stock calculation error. Expected: ${calculatedBalance}, Got: ${data.balanceStock.volume}`);
    }

    // Rule 3: No negative values allowed
    if (data.openingStock.volume < 0 || data.ytdNetSales.volume < 0 || data.liquidation.volume < 0) {
      errors.push('Stock values cannot be negative');
    }

    // Rule 4: Value consistency check
    if (data.openingStock.volume > 0 && data.openingStock.value <= 0) {
      errors.push('Stock value must be positive when volume is positive');
    }

    // Warning: Low liquidation percentage
    const liquidationPercentage = totalAvailableStock > 0 ? (data.liquidation.volume / totalAvailableStock) * 100 : 0;
    if (liquidationPercentage < 20) {
      warnings.push(`Low liquidation rate: ${liquidationPercentage.toFixed(1)}%. Target is 50%+`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 2. STOCK MOVEMENT VALIDATIONS
  static validateStockMovement(
    currentStock: number, 
    movementQuantity: number, 
    movementType: 'sale' | 'return' | 'transfer' | 'damage'
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Cannot sell more than available stock
    if (movementType === 'sale' && movementQuantity > currentStock) {
      errors.push(`Cannot sell ${movementQuantity} units. Only ${currentStock} units available in stock`);
    }

    // Rule 2: Movement quantity must be positive
    if (movementQuantity <= 0) {
      errors.push('Movement quantity must be greater than zero');
    }

    // Rule 3: Large movements need justification
    if (movementQuantity > currentStock * 0.5) {
      warnings.push(`Large stock movement detected: ${movementQuantity} units (${((movementQuantity/currentStock)*100).toFixed(1)}% of current stock)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 3. FINANCIAL VALIDATIONS
  static validateCreditLimit(
    creditLimit: number,
    outstandingAmount: number,
    pendingOrders: number,
    newOrderValue: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const availableCredit = creditLimit - outstandingAmount - pendingOrders;

    // Rule 1: Order cannot exceed available credit
    if (newOrderValue > availableCredit) {
      errors.push(`Order value ₹${newOrderValue.toLocaleString()} exceeds available credit ₹${availableCredit.toLocaleString()}`);
    }

    // Rule 2: Credit utilization warning
    const utilizationAfterOrder = ((outstandingAmount + pendingOrders + newOrderValue) / creditLimit) * 100;
    if (utilizationAfterOrder > 80) {
      warnings.push(`High credit utilization: ${utilizationAfterOrder.toFixed(1)}%`);
    }

    // Rule 3: Negative credit check
    if (availableCredit < 0) {
      errors.push('Credit limit already exceeded. No new orders allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 4. TRAVEL EXPENSE VALIDATIONS
  static validateTravelExpense(
    distance: number,
    mode: 'Car' | 'Bike' | 'Public Transport',
    amount: number,
    workingHours: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const rates = { Car: 12, Bike: 5, 'Public Transport': 0 };
    const maxDistance = 110;
    const minWorkingHours = 9;

    // Rule 1: Distance limits
    if (distance > maxDistance) {
      errors.push(`Daily travel distance (${distance}km) exceeds limit (${maxDistance}km)`);
    }

    // Rule 2: Rate validation for Car/Bike
    if (mode !== 'Public Transport') {
      const expectedAmount = distance * rates[mode];
      if (amount > expectedAmount * 1.1) { // 10% tolerance
        warnings.push(`Amount ₹${amount} seems high for ${distance}km by ${mode}. Expected: ₹${expectedAmount}`);
      }
    }

    // Rule 3: Working hours validation
    if (workingHours < minWorkingHours) {
      warnings.push(`Working hours (${workingHours}h) below minimum requirement (${minWorkingHours}h)`);
    }

    // Rule 4: Negative values
    if (distance <= 0 || amount <= 0) {
      errors.push('Distance and amount must be positive values');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 5. VISIT LOCATION VALIDATIONS
  static validateVisitLocation(
    plannedLat: number,
    plannedLng: number,
    actualLat: number,
    actualLng: number,
    toleranceKm: number = 5
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(plannedLat, plannedLng, actualLat, actualLng);

    // Rule 1: Location deviation check
    if (distance > toleranceKm) {
      errors.push(`Location deviation ${distance.toFixed(1)}km exceeds tolerance ${toleranceKm}km. TSM approval required`);
    }

    // Rule 2: Reasonable location check (within country bounds for India)
    if (actualLat < 6 || actualLat > 37 || actualLng < 68 || actualLng > 97) {
      errors.push('Location coordinates appear to be outside India. Please verify GPS accuracy');
    }

    // Warning for moderate deviation
    if (distance > toleranceKm * 0.7 && distance <= toleranceKm) {
      warnings.push(`Location deviation ${distance.toFixed(1)}km is approaching tolerance limit`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 6. PERFORMANCE SCORE VALIDATIONS
  static validatePerformanceScore(
    visitCompliance: number,
    salesAchievement: number,
    liquidationEfficiency: number,
    customerSatisfaction: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: All metrics must be between 0-100
    const metrics = { visitCompliance, salesAchievement, liquidationEfficiency, customerSatisfaction };
    Object.entries(metrics).forEach(([key, value]) => {
      if (value < 0 || value > 100) {
        errors.push(`${key} must be between 0-100. Got: ${value}`);
      }
    });

    // Rule 2: Calculate weighted score
    const weights = { visitCompliance: 0.25, salesAchievement: 0.30, liquidationEfficiency: 0.25, customerSatisfaction: 0.20 };
    const totalScore = Object.entries(weights).reduce((sum, [metric, weight]) => {
      return sum + (metrics[metric as keyof typeof metrics] * weight);
    }, 0);

    // Warning for low performance
    if (totalScore < 70) {
      warnings.push(`Overall performance score ${totalScore.toFixed(1)}% is below acceptable threshold (70%)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 7. ACTIVITY PLANNING VALIDATIONS
  static validateActivityPlan(
    plannedActivities: number,
    workingDays: number,
    territory: string,
    role: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Minimum activity requirements by role
    const minActivitiesPerDay = { MDO: 2, TSM: 1.5, RBH: 1 };
    const roleMinimum = minActivitiesPerDay[role as keyof typeof minActivitiesPerDay] || 1;
    const expectedMinimum = workingDays * roleMinimum;

    if (plannedActivities < expectedMinimum) {
      warnings.push(`Planned activities (${plannedActivities}) below recommended minimum (${expectedMinimum}) for ${role}`);
    }

    // Rule 2: Maximum activity limits
    const maxActivitiesPerDay = 4;
    const maxActivities = workingDays * maxActivitiesPerDay;
    if (plannedActivities > maxActivities) {
      errors.push(`Planned activities (${plannedActivities}) exceed maximum capacity (${maxActivities})`);
    }

    // Rule 3: Territory-specific validations
    if (territory && plannedActivities > 0) {
      // Add territory-specific business rules here
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 8. ORDER VALIDATIONS
  static validateSalesOrder(
    orderValue: number,
    customerType: 'Distributor' | 'Dealer' | 'Retailer',
    paymentTerms: string,
    userRole: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Order value limits by role
    const orderLimits = {
      MDO: 50000,
      TSM: 200000,
      RBH: 500000,
      RMM: 1000000
    };

    const roleLimit = orderLimits[userRole as keyof typeof orderLimits] || 0;
    if (orderValue > roleLimit) {
      errors.push(`Order value ₹${orderValue.toLocaleString()} exceeds ${userRole} limit ₹${roleLimit.toLocaleString()}`);
    }

    // Rule 2: Customer type vs order value validation
    const customerLimits = {
      Distributor: 1000000,
      Dealer: 500000,
      Retailer: 100000
    };

    if (orderValue > customerLimits[customerType]) {
      warnings.push(`Large order for ${customerType}: ₹${orderValue.toLocaleString()}`);
    }

    // Rule 3: Payment terms validation
    if (paymentTerms === 'Credit' && orderValue > 100000) {
      warnings.push('Large credit order requires additional approval');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 9. TIME-BASED VALIDATIONS
  static validateWorkingHours(
    checkInTime: string,
    checkOutTime: string,
    minimumHours: number = 9
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const checkIn = new Date(`2024-01-01 ${checkInTime}`);
    const checkOut = new Date(`2024-01-01 ${checkOutTime}`);
    const hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

    // Rule 1: Minimum working hours
    if (hoursWorked < minimumHours) {
      warnings.push(`Working hours (${hoursWorked.toFixed(1)}h) below minimum requirement (${minimumHours}h)`);
    }

    // Rule 2: Maximum working hours (overtime alert)
    if (hoursWorked > 12) {
      warnings.push(`Long working day: ${hoursWorked.toFixed(1)} hours. Consider work-life balance`);
    }

    // Rule 3: Logical time sequence
    if (checkOut <= checkIn) {
      errors.push('Check-out time must be after check-in time');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 10. RETAILER LIQUIDATION VALIDATIONS
  static validateRetailerLiquidation(
    assignedStock: number,
    currentStock: number,
    soldToFarmers: number,
    soldToRetailers: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Current stock cannot be negative
    if (currentStock < 0) {
      errors.push('Current stock cannot be negative');
    }

    // Rule 2: Total sales cannot exceed assigned stock
    const totalSales = soldToFarmers + soldToRetailers;
    const expectedCurrentStock = assignedStock - totalSales;
    
    if (currentStock !== expectedCurrentStock) {
      errors.push(`Stock mismatch. Expected: ${expectedCurrentStock}, Actual: ${currentStock}`);
    }

    // Rule 3: Farmer sales validation (this counts as liquidation)
    if (soldToFarmers > assignedStock) {
      errors.push(`Farmer sales (${soldToFarmers}) cannot exceed assigned stock (${assignedStock})`);
    }

    // Rule 4: Retailer sales validation (this is transfer, not liquidation)
    if (soldToRetailers > assignedStock) {
      errors.push(`Retailer sales (${soldToRetailers}) cannot exceed assigned stock (${assignedStock})`);
    }

    // Warning: High retailer sales (potential liquidation tracking needed)
    if (soldToRetailers > assignedStock * 0.7) {
      warnings.push('High retailer sales detected. Ensure proper liquidation tracking at retailer level');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 11. APPROVAL WORKFLOW VALIDATIONS
  static validateApprovalWorkflow(
    submitterRole: string,
    approverRole: string,
    requestType: string,
    requestValue?: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Role hierarchy validation
    const hierarchy = ['MDO', 'TSM', 'RBH', 'RMM', 'ZBH', 'MH', 'VP_SM', 'MD'];
    const submitterLevel = hierarchy.indexOf(submitterRole);
    const approverLevel = hierarchy.indexOf(approverRole);

    // Rule 1: Approver must be higher in hierarchy
    if (approverLevel <= submitterLevel) {
      errors.push(`${approverRole} cannot approve requests from ${submitterRole}`);
    }

    // Rule 2: Value-based approval requirements
    if (requestValue && requestType === 'expense') {
      const approvalLimits = {
        TSM: 10000,
        RBH: 50000,
        RMM: 200000,
        VP_SM: 1000000
      };

      const requiredApprover = Object.entries(approvalLimits).find(([role, limit]) => 
        requestValue <= limit
      )?.[0];

      if (requiredApprover && hierarchy.indexOf(approverRole) < hierarchy.indexOf(requiredApprover)) {
        errors.push(`Amount ₹${requestValue.toLocaleString()} requires approval from ${requiredApprover} or higher`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 12. VISIT COMPLIANCE VALIDATIONS
  static validateVisitCompliance(
    plannedVisits: number,
    completedVisits: number,
    visitDurations: number[],
    minimumDuration: number = 30
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Cannot complete more visits than planned
    if (completedVisits > plannedVisits) {
      warnings.push(`Completed visits (${completedVisits}) exceed planned visits (${plannedVisits}). Good performance!`);
    }

    // Rule 2: Visit duration validation
    const shortVisits = visitDurations.filter(duration => duration < minimumDuration);
    if (shortVisits.length > 0) {
      warnings.push(`${shortVisits.length} visits were shorter than ${minimumDuration} minutes`);
    }

    // Rule 3: Completion rate validation
    const completionRate = plannedVisits > 0 ? (completedVisits / plannedVisits) * 100 : 0;
    if (completionRate < 80) {
      warnings.push(`Visit completion rate (${completionRate.toFixed(1)}%) below target (80%)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 13. PAYMENT VALIDATIONS
  static validatePayment(
    paymentAmount: number,
    outstandingAmount: number,
    paymentMode: string,
    hasReceipt: boolean
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Rule 1: Payment cannot exceed outstanding amount
    if (paymentAmount > outstandingAmount) {
      errors.push(`Payment amount ₹${paymentAmount.toLocaleString()} exceeds outstanding ₹${outstandingAmount.toLocaleString()}`);
    }

    // Rule 2: Receipt requirement for cash payments > ₹500
    if (paymentMode === 'Cash' && paymentAmount > 500 && !hasReceipt) {
      errors.push('Receipt required for cash payments above ₹500');
    }

    // Rule 3: Large payment alerts
    if (paymentAmount > 100000) {
      warnings.push(`Large payment detected: ₹${paymentAmount.toLocaleString()}`);
    }

    // Rule 4: Negative payment check
    if (paymentAmount <= 0) {
      errors.push('Payment amount must be positive');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 14. INVENTORY VARIANCE VALIDATIONS
  static validateInventoryVariance(
    systemStock: number,
    physicalStock: number,
    varianceThreshold: number = 5
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const variance = Math.abs(systemStock - physicalStock);
    const variancePercentage = systemStock > 0 ? (variance / systemStock) * 100 : 0;

    // Rule 1: Large variance requires investigation
    if (variancePercentage > varianceThreshold) {
      if (variancePercentage > 10) {
        errors.push(`Critical stock variance: ${variancePercentage.toFixed(1)}%. Requires RBH approval`);
      } else {
        warnings.push(`Stock variance: ${variancePercentage.toFixed(1)}%. Requires TSM approval`);
      }
    }

    // Rule 2: Negative physical stock
    if (physicalStock < 0) {
      errors.push('Physical stock cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // 15. TARGET ACHIEVEMENT VALIDATIONS
  static validateTargetAchievement(
    actualValue: number,
    targetValue: number,
    metricType: 'sales' | 'visits' | 'liquidation' | 'customers'
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const achievementPercentage = targetValue > 0 ? (actualValue / targetValue) * 100 : 0;

    // Rule 1: Unrealistic achievement check
    if (achievementPercentage > 150) {
      warnings.push(`Exceptional performance: ${achievementPercentage.toFixed(1)}% of target. Please verify data accuracy`);
    }

    // Rule 2: Low achievement alerts
    if (achievementPercentage < 70) {
      warnings.push(`Low achievement: ${achievementPercentage.toFixed(1)}% of target. Action plan needed`);
    }

    // Rule 3: Negative values
    if (actualValue < 0 || targetValue < 0) {
      errors.push('Target and actual values must be non-negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // UTILITY FUNCTIONS
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // COMPREHENSIVE VALIDATION RUNNER
  static validateBusinessOperation(
    operationType: string,
    data: any
  ): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    try {
      let result: ValidationResult;

      switch (operationType) {
        case 'liquidation_update':
          result = this.validateLiquidation(data);
          break;
        case 'stock_movement':
          result = this.validateStockMovement(data.currentStock, data.quantity, data.type);
          break;
        case 'credit_check':
          result = this.validateCreditLimit(data.creditLimit, data.outstanding, data.pending, data.orderValue);
          break;
        case 'travel_expense':
          result = this.validateTravelExpense(data.distance, data.mode, data.amount, data.workingHours);
          break;
        case 'visit_location':
          result = this.validateVisitLocation(data.plannedLat, data.plannedLng, data.actualLat, data.actualLng);
          break;
        case 'performance_score':
          result = this.validatePerformanceScore(data.visit, data.sales, data.liquidation, data.satisfaction);
          break;
        case 'activity_plan':
          result = this.validateActivityPlan(data.activities, data.workingDays, data.territory, data.role);
          break;
        case 'sales_order':
          result = this.validateSalesOrder(data.orderValue, data.customerType, data.paymentTerms, data.userRole);
          break;
        case 'payment':
          result = this.validatePayment(data.amount, data.outstanding, data.mode, data.hasReceipt);
          break;
        case 'inventory_variance':
          result = this.validateInventoryVariance(data.systemStock, data.physicalStock);
          break;
        case 'target_achievement':
          result = this.validateTargetAchievement(data.actual, data.target, data.metricType);
          break;
        case 'approval_workflow':
          result = this.validateApprovalWorkflow(data.submitterRole, data.approverRole, data.requestType, data.value);
          break;
        default:
          result = { isValid: true, errors: [], warnings: [] };
      }

      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);

    } catch (error) {
      allErrors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }
}

// BUSINESS CONSTANTS
export const BUSINESS_CONSTANTS = {
  // Stock Management
  LIQUIDATION_TARGET_PERCENTAGE: 50,
  STOCK_VARIANCE_THRESHOLD: 5, // %
  CRITICAL_VARIANCE_THRESHOLD: 10, // %
  
  // Travel Management
  TRAVEL_RATES: {
    Car: 12, // ₹ per km
    Bike: 5,  // ₹ per km
    'Public Transport': 0 // Actual receipt amount
  },
  MAX_DAILY_DISTANCE: 110, // km
  MIN_WORKING_HOURS: 9,
  
  // Visit Management
  LOCATION_TOLERANCE: 5, // km
  MIN_VISIT_DURATION: 30, // minutes
  VISIT_COMPLETION_TARGET: 80, // %
  
  // Financial Management
  CASH_RECEIPT_THRESHOLD: 500, // ₹
  CREDIT_UTILIZATION_WARNING: 80, // %
  LARGE_PAYMENT_THRESHOLD: 100000, // ₹
  
  // Performance Management
  PERFORMANCE_WEIGHTS: {
    visitCompliance: 0.25,
    salesAchievement: 0.30,
    liquidationEfficiency: 0.25,
    customerSatisfaction: 0.20
  },
  MIN_PERFORMANCE_SCORE: 70, // %
  
  // Order Management
  ORDER_APPROVAL_LIMITS: {
    MDO: 50000,
    TSM: 200000,
    RBH: 500000,
    RMM: 1000000
  },
  
  // Activity Planning
  MIN_ACTIVITIES_PER_DAY: {
    MDO: 2,
    TSM: 1.5,
    RBH: 1
  },
  MAX_ACTIVITIES_PER_DAY: 4
};

// VALIDATION HELPER FUNCTIONS
export const ValidationHelpers = {
  formatCurrency: (amount: number): string => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  },

  formatPercentage: (value: number): string => {
    return `${value.toFixed(1)}%`;
  },

  isBusinessDay: (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday or Saturday
  },

  calculateWorkingDays: (startDate: Date, endDate: Date): number => {
    let count = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      if (ValidationHelpers.isBusinessDay(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  },

  validateGSTNumber: (gstNumber: string): boolean => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  },

  validatePANNumber: (panNumber: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(panNumber);
  },

  validatePhoneNumber: (phoneNumber: string): boolean => {
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber.replace(/\s+/g, ''));
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// REAL-TIME VALIDATION HOOKS
export const useBusinessValidation = () => {
  const validateAndAlert = (operationType: string, data: any): boolean => {
    const result = BusinessValidator.validateBusinessOperation(operationType, data);
    
    if (!result.isValid) {
      alert(`Validation Failed:\n${result.errors.join('\n')}`);
      return false;
    }
    
    if (result.warnings.length > 0) {
      const proceed = confirm(`Warnings:\n${result.warnings.join('\n')}\n\nDo you want to proceed?`);
      return proceed;
    }
    
    return true;
  };

  return { validateAndAlert, BusinessValidator };
};