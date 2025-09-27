import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BusinessValidator, BUSINESS_CONSTANTS, ValidationHelpers } from '../utils/businessValidation';
import RoleBasedAccess from '../components/RoleBasedAccess';
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  Droplets, 
  Calendar, 
  MapPin, 
  DollarSign,
  Target,
  Shield,
  Database,
  Settings,
  BookOpen,
  Search,
  Filter,
  Eye,
  Download,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Code,
  Workflow,
  Clock
} from 'lucide-react';

interface BusinessRule {
  id: string;
  category: string;
  title: string;
  description: string;
  formula?: string;
  example?: string;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  affectedModules: string[];
  implementationStatus: 'Implemented' | 'Pending' | 'In Progress';
}

const BusinessLogic: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'rules' | 'formulas' | 'workflows' | 'validations'>('overview');
  const [testData, setTestData] = useState({
    liquidation: { volume: 1000, value: 12.5 },
    openingStock: { volume: 2000, value: 25.0 },
    ytdNetSales: { volume: 500, value: 6.25 }
  });

  const businessRules: BusinessRule[] = [
    {
      id: 'BR001',
      category: 'Stock Liquidation',
      title: 'Liquidation Definition',
      description: 'Liquidation = Stock sold to FARMERS ONLY (non-returnable). Stock sold to retailers ≠ Liquidation as it can be returned to distributor.',
      importance: 'Critical',
      affectedModules: ['Liquidation', 'Retailer Tracking', 'Performance'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR002',
      category: 'Stock Liquidation',
      title: 'Liquidation Percentage Formula',
      description: 'Calculate liquidation percentage based on total available stock',
      formula: 'Liquidation % = (Liquidation Volume / (Opening Stock + YTD Net Sales)) × 100',
      example: 'If Opening=1000, YTD=500, Liquidation=300, then Liquidation% = (300/(1000+500))×100 = 20%',
      importance: 'Critical',
      affectedModules: ['Liquidation', 'Dashboard', 'Reports'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR003',
      category: 'Stock Liquidation',
      title: 'Balance Stock Calculation',
      description: 'Calculate remaining stock after liquidation',
      formula: 'Balance Stock = Opening Stock + YTD Net Sales - Liquidation',
      example: 'If Opening=1000, YTD=500, Liquidation=300, then Balance=1000+500-300=1200',
      importance: 'Critical',
      affectedModules: ['Liquidation', 'Inventory'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR004',
      category: 'User Management',
      title: 'Role Hierarchy',
      description: '10-level organizational hierarchy with specific reporting structure',
      formula: 'MDO → TSM → RBH → RMM → MH → VP_SM → MD',
      importance: 'Critical',
      affectedModules: ['Authentication', 'Approvals', 'User Management'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR005',
      category: 'Approvals',
      title: 'Monthly Plan Approval Logic',
      description: 'TSM plans approved by RBH. RBH/RMM plans auto-approved when TSM absent.',
      importance: 'High',
      affectedModules: ['Planning', 'Approvals'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR006',
      category: 'Field Visits',
      title: 'Location Deviation Rules',
      description: 'Visits >5km from planned location require TSM approval',
      formula: 'if (actualDistance > 5km) { requireTSMApproval = true }',
      importance: 'High',
      affectedModules: ['Field Visits', 'Approvals'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR007',
      category: 'Performance',
      title: 'Performance Score Calculation',
      description: 'Weighted average of multiple performance metrics',
      formula: 'Score = (VisitCompliance×0.25 + SalesAchievement×0.30 + LiquidationEfficiency×0.25 + CustomerSatisfaction×0.20) × 100',
      importance: 'High',
      affectedModules: ['Performance', 'Incentives'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR008',
      category: 'Financial',
      title: 'Credit Limit Validation',
      description: 'Prevent orders exceeding available credit limit',
      formula: 'Available Credit = Credit Limit - Outstanding Amount - Pending Orders',
      importance: 'Critical',
      affectedModules: ['Sales Orders', 'Financial'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR009',
      category: 'Travel',
      title: 'Travel Expense Limits',
      description: 'Daily travel and expense limits with approval workflows',
      formula: 'Car: ₹12/km, Bike: ₹5/km, Max: 110km/day, Min: 9hrs work',
      importance: 'Medium',
      affectedModules: ['Travel', 'Approvals'],
      implementationStatus: 'Implemented'
    },
    {
      id: 'BR010',
      category: 'Planning',
      title: 'Activity Categories',
      description: 'Three main categories with specific activity types and participant limits',
      example: 'Farmer BTL: Farmer Meets (Small/Large), Farm demos, Training Programs (25 dealers max, 50 retailers max)',
      importance: 'High',
      affectedModules: ['Planning', 'MDO Module'],
      implementationStatus: 'Implemented'
    }
  ];
  
  // Test validation function
  const testValidation = (validationType: string) => {
    let result;
    
    switch (validationType) {
      case 'liquidation':
        result = BusinessValidator.validateLiquidation({
          openingStock: testData.openingStock,
          ytdNetSales: testData.ytdNetSales,
          liquidation: testData.liquidation,
          balanceStock: { volume: 0, value: 0 }
        });
        break;
      case 'stock_movement':
        result = BusinessValidator.validateStockMovement(1000, 1200, 'sale');
        break;
      case 'credit_limit':
        result = BusinessValidator.validateCreditLimit(100000, 60000, 20000, 30000);
        break;
      default:
        result = { isValid: true, errors: [], warnings: [] };
    }
    
    alert(`Validation Result:\n\nValid: ${result.isValid}\n\nErrors:\n${result.errors.join('\n')}\n\nWarnings:\n${result.warnings.join('\n')}`);
  };

  const categories = ['All', 'Stock Liquidation', 'User Management', 'Approvals', 'Field Visits', 'Performance', 'Financial', 'Travel', 'Planning'];

  const filteredRules = businessRules.filter(rule => {
    const matchesCategory = selectedCategory === 'All' || rule.category === selectedCategory;
    const matchesSearch = rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Implemented': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'Critical': return <AlertTriangle className="w-4 h-4" />;
      case 'High': return <Info className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rules</p>
              <p className="text-2xl font-bold text-gray-900">{businessRules.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Rules</p>
              <p className="text-2xl font-bold text-gray-900">
                {businessRules.filter(r => r.importance === 'Critical').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Implemented</p>
              <p className="text-2xl font-bold text-gray-900">
                {businessRules.filter(r => r.implementationStatus === 'Implemented').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Business Rules */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Critical Business Rules</h3>
        <div className="space-y-4">
          {/* Live Validation Testing */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-900 mb-3">🧪 Live Validation Testing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => testValidation('liquidation')}
                className="bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700"
              >
                Test Liquidation Rules
              </button>
              <button
                onClick={() => testValidation('stock_movement')}
                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
              >
                Test Stock Movement
              </button>
              <button
                onClick={() => testValidation('credit_limit')}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                Test Credit Validation
              </button>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              Click buttons to test validation rules with sample data
            </p>
          </div>
          
          {businessRules.filter(r => r.importance === 'Critical').map(rule => (
            <div key={rule.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">{rule.title}</h4>
              <p className="text-red-800 text-sm">{rule.description}</p>
              {rule.formula && (
                <div className="mt-2 p-2 bg-red-100 rounded font-mono text-sm text-red-900">
                  {rule.formula}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Module Coverage */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Coverage</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Liquidation', 'Field Visits', 'Planning', 'Approvals', 'Performance', 'Financial', 'User Management', 'Travel'].map(module => {
            const moduleRules = businessRules.filter(r => r.affectedModules.includes(module));
            return (
              <div key={module} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{moduleRules.length}</div>
                <div className="text-sm text-gray-600">{module}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {moduleRules.filter(r => r.importance === 'Critical').length} Critical
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderRules = () => (
    <div className="space-y-4">
      {filteredRules.map(rule => (
        <div key={rule.id} className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getImportanceColor(rule.importance)}`}>
                {getImportanceIcon(rule.importance)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{rule.title}</h3>
                <p className="text-sm text-gray-600">{rule.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(rule.importance)}`}>
                {rule.importance}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.implementationStatus)}`}>
                {rule.implementationStatus}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{rule.description}</p>

          {rule.formula && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Formula:</h4>
              <code className="text-sm text-purple-800 bg-purple-100 px-2 py-1 rounded">
                {rule.formula}
              </code>
            </div>
          )}

          {rule.example && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Example:</h4>
              <p className="text-sm text-blue-800">{rule.example}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {rule.affectedModules.map(module => (
                <span key={module} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {module}
                </span>
              ))}
            </div>
            <button
              onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
              className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
            >
              {expandedRule === rule.id ? (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  View Details
                </>
              )}
            </button>
          </div>

          {expandedRule === rule.id && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Implementation Details</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rule ID:</span>
                      <span className="font-medium">{rule.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{rule.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.implementationStatus)}`}>
                        {rule.implementationStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Affected Modules</h5>
                  <div className="space-y-1">
                    {rule.affectedModules.map(module => (
                      <div key={module} className="flex items-center text-sm">
                        <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                        <span>{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderFormulas = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Business Formulas</h3>
        
        <div className="space-y-6">
          {/* Stock Liquidation Formulas */}
          <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-3">Stock Liquidation Formulas</h4>
            
            {/* Interactive Formula Testing */}
            <div className="bg-white p-4 rounded-lg border mb-4">
              <h5 className="font-medium text-gray-900 mb-3">🧮 Interactive Formula Calculator</h5>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    value={testData.openingStock.volume}
                    onChange={(e) => setTestData(prev => ({
                      ...prev,
                      openingStock: { ...prev.openingStock, volume: Number(e.target.value) }
                    }))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">YTD Sales</label>
                  <input
                    type="number"
                    value={testData.ytdNetSales.volume}
                    onChange={(e) => setTestData(prev => ({
                      ...prev,
                      ytdNetSales: { ...prev.ytdNetSales, volume: Number(e.target.value) }
                    }))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Liquidation</label>
                  <input
                    type="number"
                    value={testData.liquidation.volume}
                    onChange={(e) => setTestData(prev => ({
                      ...prev,
                      liquidation: { ...prev.liquidation, volume: Number(e.target.value) }
                    }))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <span className="text-blue-600 font-medium">Balance Stock:</span>
                  <span className="ml-2 font-bold">
                    {testData.openingStock.volume + testData.ytdNetSales.volume - testData.liquidation.volume}
                  </span>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <span className="text-green-600 font-medium">Liquidation %:</span>
                  <span className="ml-2 font-bold">
                    {((testData.liquidation.volume / (testData.openingStock.volume + testData.ytdNetSales.volume)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => testValidation('liquidation')}
                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700"
              >
                Validate These Values
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-900 mb-1">Liquidation Percentage</h5>
                <code className="text-sm text-purple-800 bg-purple-100 px-2 py-1 rounded block">
                  Liquidation % = (Liquidation Volume / (Opening Stock + YTD Net Sales)) × 100
                </code>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-900 mb-1">Balance Stock</h5>
                <code className="text-sm text-purple-800 bg-purple-100 px-2 py-1 rounded block">
                  Balance Stock = Opening Stock + YTD Net Sales - Liquidation
                </code>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-900 mb-1">Value Calculation</h5>
                <code className="text-sm text-purple-800 bg-purple-100 px-2 py-1 rounded block">
                  Value = Volume × Weighted Average Unit Price
                </code>
              </div>
            </div>
          </div>

          {/* Performance Formulas */}
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-3">Performance Calculation</h4>
            <div className="bg-white p-3 rounded border">
              <h5 className="font-medium text-gray-900 mb-1">Overall Performance Score</h5>
              <code className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded block">
                Score = (Visit Compliance × 0.25 + Sales Achievement × 0.30 + Liquidation Efficiency × 0.25 + Customer Satisfaction × 0.20) × 100
              </code>
            </div>
          </div>

          {/* Financial Formulas */}
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Financial Calculations</h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-900 mb-1">Available Credit</h5>
                <code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded block">
                  Available Credit = Credit Limit - Outstanding Amount - Pending Orders
                </code>
              </div>
              <div className="bg-white p-3 rounded border">
                <h5 className="font-medium text-gray-900 mb-1">Travel Expense</h5>
                <code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded block">
                  Car: ₹12/km | Bike: ₹5/km | Max: 110km/day | Min: 9hrs work
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Workflows</h3>
        
        <div className="space-y-6">
          {/* Monthly Plan Workflow */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Monthly Plan Approval</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-16 text-sm font-medium">TSM:</span>
                <span className="text-sm">Plans for MDO team → RBH approval</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16 text-sm font-medium">RBH/RMM:</span>
                <span className="text-sm">Emergency plans → Auto-approved (TSM absent)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16 text-sm font-medium">ZBH/MH:</span>
                <span className="text-sm">Strategic plans → VP_SM approval</span>
              </div>
            </div>
          </div>

          {/* Location Deviation Workflow */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Location Deviation Approval</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-16 text-sm font-medium">≤5km:</span>
                <span className="text-sm">Auto-approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16 text-sm font-medium">>5km:</span>
                <span className="text-sm">TSM approval required with justification</span>
              </div>
            </div>
          </div>

          {/* Stock Variance Workflow */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Stock Variance Approval</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-16 text-sm font-medium">≤5%:</span>
                <span className="text-sm">MDO can adjust</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16 text-sm font-medium">5-10%:</span>
                <span className="text-sm">TSM approval required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16 text-sm font-medium">>10%:</span>
                <span className="text-sm">RBH approval required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderValidationRules = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Comprehensive Validation Rules</h3>
        
        <div className="space-y-6">
          {/* Stock Validations */}
          <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-3">Stock Management Validations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span>Liquidation ≤ Available Stock</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span>No Negative Stock Values</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span>Balance = Opening + YTD - Liquidation</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span>Value Consistency (Volume > 0 → Value > 0)</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span>Liquidation Rate ≤ 100%</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span>Stock Variance ≤ 10% (Critical)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Validations */}
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-3">Financial Validations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Order Value ≤ Available Credit</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Payment ≤ Outstanding Amount</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>GST/PAN Format Validation</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Receipt Required (Cash >₹500)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Credit Utilization Alerts (>80%)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Large Transaction Alerts (>₹1L)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Travel & Location Validations */}
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Travel & Location Validations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Daily Distance ≤ 110km</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Working Hours ≥ 9 hours</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Location Deviation ≤ 5km</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Car: ₹12/km, Bike: ₹5/km</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-blue-600 mr-2" />
                  <span>GPS Coordinates (India Bounds)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Visit Duration ≥ 30 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Logic Documentation</h1>
            <p className="text-gray-600 mt-1">Comprehensive business rules and implementation guidelines</p>
          </div>
        </div>
        <RoleBasedAccess allowedRoles={['MD', 'VP_SM', 'MH']}>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </RoleBasedAccess>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl p-2 card-shadow">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
              selectedView === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2 inline" />
            Overview
          </button>
          <button
            onClick={() => setSelectedView('rules')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
              selectedView === 'rules'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-4 h-4 mr-2 inline" />
            Business Rules
          </button>
          <button
            onClick={() => setSelectedView('formulas')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
              selectedView === 'formulas'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Code className="w-4 h-4 mr-2 inline" />
            Formulas
          </button>
          <button
            onClick={() => setSelectedView('workflows')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
              selectedView === 'workflows'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Workflow className="w-4 h-4 mr-2 inline" />
            Workflows
          </button>
          <button
            onClick={() => setSelectedView('validations')}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
              selectedView === 'validations'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-2 inline" />
            Validations
          </button>
        </div>
      </div>

      {/* Filters - Only show for rules view */}
      {selectedView === 'rules' && (
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search business rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>Showing {filteredRules.length} of {businessRules.length} rules</span>
            <div className="flex items-center space-x-4">
              <span>Critical: {filteredRules.filter(r => r.importance === 'Critical').length}</span>
              <span>Implemented: {filteredRules.filter(r => r.implementationStatus === 'Implemented').length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'rules' && renderRules()}
      {selectedView === 'formulas' && renderFormulas()}
      {selectedView === 'workflows' && renderWorkflows()}
      {selectedView === 'validations' && renderValidationRules()}

      {/* No Results */}
      {selectedView === 'rules' && filteredRules.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No business rules found</p>
        </div>
      )}
    </div>
  );
};

export default BusinessLogic;