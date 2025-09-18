import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  CheckSquare, 
  Droplets, 
  FileText,
  User,
  Calendar,
  Package,
  TrendingUp,
  Target,
  Building,
  Search,
  Filter,
  Eye,
  CheckCircle,
  X,
  Save,
  Plus,
  Minus,
  Phone,
  Mail,
  Navigation,
  Clock,
  DollarSign,
  Camera,
  Upload
} from 'lucide-react';

interface MobileAppProps {}

const MobileApp: React.FC<MobileAppProps> = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<any>({});

  // Sample data for mobile app
  const distributors = [
    {
      id: 'DIST001',
      name: 'SRI RAMA SEEDS',
      code: '1325',
      territory: 'North Delhi',
      liquidationRate: 40,
      status: 'Active',
      priority: 'High'
    },
    {
      id: 'DIST002', 
      name: 'Ram Kumar Distributors',
      code: 'DLR001',
      territory: 'Green Valley',
      liquidationRate: 29,
      status: 'Active',
      priority: 'Medium'
    }
  ];

  const getSKUData = (distributorId: string) => {
    return [
      {
        skuCode: 'DAP-25KG',
        skuName: 'DAP 25kg Bag',
        unit: 'Kg',
        invoices: [
          {
            invoiceNumber: 'INV-2024-001',
            invoiceDate: '2024-08-01',
            currentStock: 50,
            batchNumber: 'BATCH-001'
          },
          {
            invoiceNumber: 'INV-2024-002', 
            invoiceDate: '2024-08-07',
            currentStock: 30,
            batchNumber: 'BATCH-002'
          },
          {
            invoiceNumber: 'INV-2024-003',
            invoiceDate: '2024-08-10', 
            currentStock: 25,
            batchNumber: 'BATCH-003'
          }
        ]
      },
      {
        skuCode: 'DAP-50KG',
        skuName: 'DAP 50kg Bag',
        unit: 'Kg',
        invoices: [
          {
            invoiceNumber: 'INV-2024-004',
            invoiceDate: '2024-08-01',
            currentStock: 40,
            batchNumber: 'BATCH-004'
          },
          {
            invoiceNumber: 'INV-2024-005',
            invoiceDate: '2024-08-07',
            currentStock: 35,
            batchNumber: 'BATCH-005'
          }
        ]
      }
    ];
  };

  const handleVerifyClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    
    // Initialize verification data for multiple invoices
    const skuData = getSKUData(distributor.id);
    const skuVerifications: Record<string, { current: number; physical: number; variance: number }> = {};
    
    skuData.forEach(sku => {
      sku.invoices.forEach(invoice => {
        const key = `${sku.skuCode}-${invoice.invoiceNumber}`;
        skuVerifications[key] = {
          current: invoice.currentStock,
          physical: 0,
          variance: -invoice.currentStock
        };
      });
    });

    setVerificationData({ skuVerifications, remarks: '' });
    setShowVerifyModal(true);
  };

  const handleSKUStockChange = (skuCode: string, invoiceNumber: string, field: 'current' | 'physical', value: number) => {
    setVerificationData((prev: any) => {
      const updated = { ...prev };
      const key = `${skuCode}-${invoiceNumber}`;
      if (!updated.skuVerifications[key]) {
        updated.skuVerifications[key] = { current: 0, physical: 0, variance: 0 };
      }
      
      updated.skuVerifications[key][field] = value;
      updated.skuVerifications[key].variance = 
        updated.skuVerifications[key].physical - updated.skuVerifications[key].current;
      
      return updated;
    });
  };

  const renderDashboard = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white">
        <h2 className="text-lg font-bold mb-1">Good Morning!</h2>
        <p className="text-sm opacity-90">Today's Activities</p>
        <div className="flex justify-between items-end mt-3">
          <div>
            <div className="text-2xl font-bold">8</div>
            <div className="text-xs opacity-80">Visits Planned</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">3</div>
            <div className="text-xs opacity-80">Completed</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-lg font-bold text-blue-600">85%</div>
          <div className="text-xs text-gray-600">Visit Target</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-lg font-bold text-green-600">₹4.2L</div>
          <div className="text-xs text-gray-600">Sales MTD</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Visit completed</p>
              <p className="text-xs text-gray-600">SRI RAMA SEEDS - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New order received</p>
              <p className="text-xs text-gray-600">Green Agro - ₹45,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLiquidation = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-2">Stock Liquidation</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">28%</div>
            <div className="text-xs text-gray-600">Overall Rate</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">3</div>
            <div className="text-xs text-gray-600">Distributors</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search distributors..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Distributors List */}
      <div className="space-y-3">
        {distributors.map((distributor) => (
          <div key={distributor.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{distributor.name}</h3>
                <p className="text-xs text-gray-600">{distributor.code} • {distributor.territory}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">{distributor.liquidationRate}%</div>
                <div className="text-xs text-gray-600">Liquidation</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg text-sm">
                <Eye className="w-3 h-3 mr-1 inline" />
                View
              </button>
              <button 
                onClick={() => handleVerifyClick(distributor)}
                className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm"
              >
                <CheckCircle className="w-3 h-3 mr-1 inline" />
                Verify
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-3">Today's Tasks</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Visit SRI RAMA SEEDS</p>
              <p className="text-xs text-gray-600">10:00 AM • Stock verification</p>
            </div>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Monthly Report</p>
              <p className="text-xs text-gray-600">Due: Jan 25 • Sales performance</p>
            </div>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracker = () => (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-3">Route Tracker</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Ram Kumar</p>
                <p className="text-xs text-gray-600">Completed • 11:30 AM</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Suresh Traders</p>
                <p className="text-xs text-gray-600">In Progress • 2:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-3">Reports</h2>
        <div className="space-y-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-sm">Daily Visit Report</h3>
            <p className="text-xs text-gray-600 mb-2">3 visits completed today</p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm">
              Generate Report
            </button>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-sm">Monthly Performance</h3>
            <p className="text-xs text-gray-600 mb-2">Sales: ₹4.2L | Target: ₹5L</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'tracker':
        return renderTracker();
      case 'tasks':
        return renderTasks();
      case 'liquidation':
        return renderLiquidation();
      case 'reports':
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Gencrest</h1>
            <p className="text-xs text-gray-600">Activity Tracker</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 relative">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Stock Verification Modal for Mobile */}
      {showVerifyModal && selectedDistributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Stock Verification</h3>
                <p className="text-sm text-gray-600">{selectedDistributor.name}</p>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {getSKUData(selectedDistributor.id).map((sku) => (
                  <div key={sku.skuCode} className="bg-gray-50 rounded-lg p-3">
                    {/* SKU Header */}
                    <div className="mb-3">
                      <h5 className="font-semibold text-gray-900">{sku.skuName}</h5>
                      <p className="text-xs text-gray-600">SKU: {sku.skuCode}</p>
                    </div>
                    
                    {/* Invoice-wise verification */}
                    <div className="space-y-3">
                      {sku.invoices.map((invoice) => {
                        const verificationKey = `${sku.skuCode}-${invoice.invoiceNumber}`;
                        const variance = verificationData.skuVerifications?.[verificationKey]?.variance || 0;
                        
                        return (
                          <div key={invoice.invoiceNumber} className="bg-white rounded-lg border p-3">
                            {/* Invoice Info */}
                            <div className="mb-2">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-gray-900">{invoice.invoiceNumber}</p>
                                <p className="text-xs text-gray-500">{invoice.batchNumber}</p>
                              </div>
                              <p className="text-xs text-gray-500">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                            </div>
                            
                            {/* Single line: SKU Name - Current Stock - Physical Stock */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{sku.skuName}</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                {/* Current Stock */}
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Current Stock</p>
                                  <input
                                    type="number"
                                    value={verificationData.skuVerifications?.[verificationKey]?.current || invoice.currentStock}
                                    onChange={(e) => handleSKUStockChange(sku.skuCode, invoice.invoiceNumber, 'current', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                  />
                                </div>
                                
                                {/* Physical Stock */}
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Physical Stock</p>
                                  <input
                                    type="number"
                                    value={verificationData.skuVerifications?.[verificationKey]?.physical || ''}
                                    onChange={(e) => handleSKUStockChange(sku.skuCode, invoice.invoiceNumber, 'physical', parseInt(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                    placeholder="Enter"
                                  />
                                </div>
                              </div>
                              
                              {/* Variance */}
                              {variance !== 0 && (
                                <div className={`p-2 rounded text-xs ${
                                  variance > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                }`}>
                                  Variance: {variance > 0 ? '+' : ''}{variance} {sku.unit}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Remarks */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={verificationData.remarks || ''}
                  onChange={(e) => setVerificationData((prev: any) => ({ ...prev, remarks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={2}
                  placeholder="Add verification remarks..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 p-4 border-t">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Stock verified for ${selectedDistributor.name}!`);
                  setShowVerifyModal(false);
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm"
              >
                Verify Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex justify-around">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'tracker', icon: MapPin, label: 'Tracker' },
            { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
            { id: 'liquidation', icon: Droplets, label: 'Liquidation' },
            { id: 'reports', icon: FileText, label: 'Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileApp;