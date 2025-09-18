export interface UserRole {
  id: string;
  code: string;
  name: string;
  level: number;
  description: string;
  permissions: Permission[];
  canApprove: string[]; // Role codes that this role can approve
  reportsTo?: string; // Role code of immediate supervisor
}

export interface Permission {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve')[];
}

export interface User {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  territory?: string;
  region?: string;
  zone?: string;
  state?: string;
  reportsTo?: string; // User ID of immediate supervisor
  isActive: boolean;
  joinDate: string;
  profileImage?: string;
}

export interface ApprovalWorkflow {
  id: string;
  type: 'monthly_plan' | 'travel_claim' | 'expense_report' | 'target_revision';
  submittedBy: string;
  submittedByRole: string;
  currentApprover: string;
  currentApproverRole: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  submissionDate: string;
  approvalDate?: string;
  comments?: string;
  data: any; // The actual plan/claim/report data
  approvalChain: ApprovalStep[];
}

export interface ApprovalStep {
  approverRole: string;
  approverUserId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  date?: string;
  comments?: string;
}

// Organizational Hierarchy Definition
export const ROLE_HIERARCHY: UserRole[] = [
  {
    id: 'MDO',
    code: 'MDO',
    name: 'Market Development Officer / Sales Officer',
    level: 1,
    description: 'Lowest field executive responsible for dealer visits and sales',
    permissions: [
      { module: 'field_visits', actions: ['view', 'create', 'edit'] },
      { module: 'sales_orders', actions: ['view', 'create', 'edit'] },
      { module: 'liquidation', actions: ['view', 'edit'] },
      { module: 'contacts', actions: ['view', 'create', 'edit'] },
      { module: 'travel_claims', actions: ['view', 'create', 'edit'] },
      { module: 'monthly_plans', actions: ['view'] } // MDO can only view plans, cannot create
    ],
    canApprove: [],
    reportsTo: 'TSM'
  },
  {
    id: 'TSM',
    code: 'TSM',
    name: 'Territory Sales Manager',
    level: 2,
    description: 'Manages MDOs and approves their plans',
    permissions: [
      { module: 'field_visits', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'sales_orders', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'liquidation', actions: ['view', 'edit', 'approve'] },
      { module: 'contacts', actions: ['view', 'create', 'edit', 'delete'] },
      { module: 'travel_claims', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'monthly_plans', actions: ['view', 'create', 'edit', 'approve'] }, // TSM creates plans for MDO and self
      { module: 'team_management', actions: ['view', 'edit'] }
    ],
    canApprove: ['MDO'],
    reportsTo: 'RBH'
  },
  {
    id: 'RBH',
    code: 'RBH',
    name: 'Regional Business Head',
    level: 3,
    description: 'Manages TSMs and regional operations',
    permissions: [
      { module: 'field_visits', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'sales_orders', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'liquidation', actions: ['view', 'edit', 'approve'] },
      { module: 'contacts', actions: ['view', 'create', 'edit', 'delete', 'approve'] },
      { module: 'travel_claims', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'monthly_plans', actions: ['view', 'create', 'edit', 'approve'] }, // RBH can create plans when TSM absent - no approval needed
      { module: 'team_management', actions: ['view', 'edit', 'approve'] },
      { module: 'regional_reports', actions: ['view', 'create', 'edit'] }
    ],
    canApprove: ['MDO', 'TSM'],
    reportsTo: 'RMM'
  },
  {
    id: 'RMM',
    code: 'RMM',
    name: 'Regional Marketing Manager',
    level: 4,
    description: 'Manages regional marketing and business operations',
    permissions: [
      { module: 'field_visits', actions: ['view', 'approve'] },
      { module: 'sales_orders', actions: ['view', 'approve'] },
      { module: 'liquidation', actions: ['view', 'approve'] },
      { module: 'contacts', actions: ['view', 'approve'] },
      { module: 'travel_claims', actions: ['view', 'approve'] },
      { module: 'monthly_plans', actions: ['view', 'create', 'edit', 'approve'] }, // RMM can create plans when TSM absent - no approval needed
      { module: 'team_management', actions: ['view', 'edit', 'approve'] },
      { module: 'regional_reports', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'marketing_campaigns', actions: ['view', 'create', 'edit', 'approve'] }
    ],
    canApprove: ['MDO', 'TSM', 'RBH'],
    reportsTo: 'MH'
  },
  {
    id: 'ZBH',
    code: 'ZBH',
    name: 'Zonal Business Head',
    level: 5,
    description: 'Manages zonal operations and multiple regions',
    permissions: [
      { module: 'field_visits', actions: ['view', 'approve'] },
      { module: 'sales_orders', actions: ['view', 'approve'] },
      { module: 'liquidation', actions: ['view', 'approve'] },
      { module: 'contacts', actions: ['view', 'approve'] },
      { module: 'travel_claims', actions: ['view', 'approve'] },
      { module: 'monthly_plans', actions: ['view', 'approve'] },
      { module: 'team_management', actions: ['view', 'edit', 'approve'] },
      { module: 'zonal_reports', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'strategic_planning', actions: ['view', 'create', 'edit'] }
    ],
    canApprove: ['MDO', 'TSM', 'RBH', 'RMM'],
    reportsTo: 'VP_SM'
  },
  {
    id: 'MH',
    code: 'MH',
    name: 'Marketing Head',
    level: 6,
    description: 'Head of Marketing operations',
    permissions: [
      { module: 'field_visits', actions: ['view', 'approve'] },
      { module: 'sales_orders', actions: ['view', 'approve'] },
      { module: 'liquidation', actions: ['view', 'approve'] },
      { module: 'monthly_plans', actions: ['view', 'approve'] },
      { module: 'marketing_campaigns', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'strategic_planning', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'budget_management', actions: ['view', 'create', 'edit'] }
    ],
    canApprove: ['RMM'], // Special: RMM reports to Marketing Head
    reportsTo: 'VP_SM'
  },
  {
    id: 'VP_SM',
    code: 'VP_SM',
    name: 'VP - Sales and Marketing',
    level: 7,
    description: 'Vice President of Sales and Marketing',
    permissions: [
      { module: 'all', actions: ['view', 'approve'] },
      { module: 'strategic_planning', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'budget_management', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'executive_reports', actions: ['view', 'create', 'edit'] }
    ],
    canApprove: ['ZBH', 'MH'], // Special: ZBH reports to VP-Sales & Marketing
    reportsTo: 'MD'
  },
  {
    id: 'MD',
    code: 'MD',
    name: 'Managing Director',
    level: 8,
    description: 'Managing Director - View all users and operations',
    permissions: [
      { module: 'all', actions: ['view'] },
      { module: 'executive_dashboard', actions: ['view'] },
      { module: 'company_reports', actions: ['view'] }
    ],
    canApprove: ['VP_SM'],
    reportsTo: undefined
  },
  {
    id: 'CHRO',
    code: 'CHRO',
    name: 'CHRO & HR Manager',
    level: 9,
    description: 'Chief Human Resources Officer - View all users',
    permissions: [
      { module: 'all', actions: ['view'] },
      { module: 'hr_management', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'employee_data', actions: ['view', 'edit'] }
    ],
    canApprove: [],
    reportsTo: 'MD'
  },
  {
    id: 'CFO',
    code: 'CFO',
    name: 'CFO & Finance Manager',
    level: 10,
    description: 'Chief Financial Officer - View all users',
    permissions: [
      { module: 'all', actions: ['view'] },
      { module: 'financial_reports', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'budget_approval', actions: ['view', 'approve'] }
    ],
    canApprove: [],
    reportsTo: 'MD'
  }
];

// Helper functions
export const getRoleByCode = (code: string): UserRole | undefined => {
  return ROLE_HIERARCHY.find(role => role.code === code);
};

export const getReportingChain = (roleCode: string): string[] => {
  const chain: string[] = [];
  let currentRole = getRoleByCode(roleCode);
  
  while (currentRole?.reportsTo) {
    chain.push(currentRole.reportsTo);
    currentRole = getRoleByCode(currentRole.reportsTo);
  }
  
  return chain;
};

export const canUserApprove = (approverRole: string, submitterRole: string): boolean => {
  const approver = getRoleByCode(approverRole);
  return approver?.canApprove.includes(submitterRole) || false;
};

export const getApprovalWorkflow = (submitterRole: string, type: ApprovalWorkflow['type']): string[] => {
  const reportingChain = getReportingChain(submitterRole);
  
  // Special approval rules based on business requirements
  switch (type) {
    case 'monthly_plan':
      if (submitterRole === 'TSM') {
        return ['RBH']; // TSM plans (for MDO and self) approved by RBH
      }
      if (submitterRole === 'RBH' || submitterRole === 'RMM') {
        return []; // RBH/RMM plans created in TSM absence - no approval needed
      }
      if (submitterRole === 'ZBH') {
        return ['VP_SM']; // ZBH plans approved by VP-Sales & Marketing
      }
      if (submitterRole === 'MH') {
        return ['VP_SM']; // Marketing Head plans approved by VP-Sales & Marketing
      }
      // For others, immediate supervisor approves
      return reportingChain.slice(0, 1);
      
    case 'travel_claim':
      // Travel claims approved by immediate supervisor
      return reportingChain.slice(0, 1);
      
    case 'expense_report':
      // Expense reports approved by immediate supervisor
      return reportingChain.slice(0, 1);
      
    case 'target_revision':
      // Target revisions need higher level approval
      return reportingChain.slice(0, 2);
      
    default:
      return reportingChain.slice(0, 1);
  }
};