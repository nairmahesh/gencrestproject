import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Package, 
  TrendingUp, 
  Target, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Building,
  MapPin,
  Calendar,
  ArrowLeft,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';

interface SKUInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  currentStock: number;
  batchNumber: string;
}

interface SKUData {
  skuCode: string;
  skuName: string;
  unit: string;
  invoices: SKUInvoice[];
}

interface LiquidationEntry {
  id: string;
  distributorName: string;
  distributorCode: string;
  territory: string;
  region: string;
  zone: string;
  status: 'Active' | 'Inactive';
  priority: 'High' | 'Medium' | 'Low';
  metrics: {
    openingStock: { volume: number; value: number };
    ytdNetSales: { volume: number; value: number };
    liquidation: { volume: number; value: number };
    balanceStock: { volume: number; value: number };
    liquidationPercentage: number;
    lastUpdated: string;
  };
}

interface VerificationData {
  skuVerifications: Record<string, { current: number; physical: number; variance: number }>;
  verifiedBy: string;
  verificationDate: string;
  remarks: string;
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LiquidationEntry | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData>({
    skuVerifications: {},
    verifiedBy: 'Current User',
    verificationDate: new Date().toISOString(),
    remarks: ''
  });

  const liquidationData: LiquidationEntry[] = [
    {
      id: 'DIST001',
      distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
      distributorCode: '1325',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'High',
      metrics: {
        openingStock: { volume: 40, value: 13.80 },
        ytdNetSales: { volume: 310, value: 13.95 },
        liquidation: { volume: 140, value: 9.30 },
        balanceStock: { volume: 210, value: 18.45 },
        liquidationPercentage: 40,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: 'DIST002',
      distributorName: 'Ram Kumar Distributors',
      distributorCode: 'DLR001',
      territory: 'Green Valley',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Medium',
      metrics: {
        openingStock: { volume: 15000, value: 18.75 },
        ytdNetSales: { volume: 6500, value: 8.13 },
        liquidation: { volume: 6200, value: 7.75 },
        balanceStock: { volume: 15300, value: 19.13 },
        liquidationPercentage: 29,
        lastUpdated: new Date().toISOString()
      }
    },
    {
      id: 'DIST003',
      distributorName: 'Green Agro Solutions',
      distributorCode: 'GAS001',
      territory: 'Sector 8',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Low',
      metrics: {
        openingStock: { volume: 17620, value: 21.70 },
        ytdNetSales: { volume: 6493, value: 6.57 },
        liquidation: { volume: 6380, value: 7.22 },
        balanceStock: { volume: 17733, value: 21.05 },
        liquidationPercentage: 26,
        lastUpdated: new Date().toISOString()
      }
    }
  ];

  const getSKUData = (distributorId: string): SKUData[] => {
    // Sample SKU data with multiple invoices for same SKU
    const skuData: SKUData[] = [
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
    return skuData;
  };

  const handleVerifyClick = (item: LiquidationEntry) => {
    setSelectedItem(item);
    
    // Initialize SKU verifications for multiple invoices
    const skuData = getSKUData(item.id);
    const skuVerifications: Record<string, { current: number; physical: number; variance: number }> = {};
    
    skuData.forEach(sku => {
      sku.invoices.forEach(invoice => {
        const key = `${sku.skuCode}-${invoice.invoiceNumber}`;
        skuVerifications[key] = {
          current: invoice.currentStock,
          physical: 0,
          variance: -invoice.currentStock // Initial variance (0 - current)
        };
      });
    });

    setVerificationData({
      skuVerifications,
      verifiedBy: 'Current User',
      verificationDate: new Date().toISOString(),
      remarks: ''
    });
    
    setShowVerifyModal(true);
  };

  const handleSKUStockChange = (skuCode: string, invoiceNumber: string, field: 'current' | 'physical', value: number) => {
    setVerificationData(prev => {
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

  const handleVerifySubmit = () => {
    if (!selectedItem) return;
    
    console.log('Stock verification submitted:', {
      distributorId: selectedItem.id,
      distributorName: selectedItem.distributorName,
      verificationData,
      timestamp: new Date().toISOString()
    });
    
    alert(`Stock verified for ${selectedItem.distributorName}!`);
    setShowVerifyModal(false);
    setSelectedItem(null);
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredData = liquidationData.filter(item => {
    const matchesSearch = item.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.distributorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.territory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
            <h1 className="text-2xl font-bold text-gray-900">Stock Liquidation</h1>
            <p className="text-gray-600 mt-1">Track and manage distributor stock liquidation</p>
          </div>
        </div>
      </div>

      {/* Overall Stock Liquidation */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Overall Stock Liquidation</h3>
            <p className="text-sm text-gray-600 mt-1">Last updated: 9/18/2025</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">28%</div>
            <div className="text-sm text-purple-600">Liquidation Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Opening Stock</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-800">32,660</div>
              <div className="text-sm text-orange-600">Kg/Litre</div>
              <div className="text-base font-semibold text-orange-700">₹40.55L</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">YTD Net Sales</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-800">23,303</div>
              <div className="text-sm text-blue-600">Kg/Litre</div>
              <div className="text-base font-semibold text-blue-700">₹27.36L</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-800">12,720</div>
              <div className="text-sm text-green-600">Kg/Litre</div>
              <div className="text-base font-semibold text-green-700">₹16.55L</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Balance Stock</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-800">43,243</div>
              <div className="text-sm text-purple-600">Kg/Litre</div>
              <div className="text-base font-semibold text-purple-700">₹51.36L</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Main Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search distributors, codes, territories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Tag Search */}
          <div className="flex-1">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tags..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Clear All Button */}
          {selectedTags.length > 0 && (
            <button
              onClick={clearAllTags}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {filteredData.length} of {liquidationData.length} distributors</span>
        <div className="flex items-center space-x-4">
          <span>Active: {filteredData.filter(d => d.status === 'Active').length}</span>
          <span>High Priority: {filteredData.filter(d => d.priority === 'High').length}</span>
        </div>
      </div>

      {/* Distributors List */}
      <div className="space-y-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.distributorName}</h3>
                  <p className="text-sm text-gray-600">{item.distributorCode} • {item.territory}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-800">{item.metrics.openingStock.volume.toLocaleString()}</div>
                <div className="text-xs text-orange-600">Opening Stock</div>
                <div className="text-xs text-orange-700">₹{item.metrics.openingStock.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-800">{item.metrics.ytdNetSales.volume.toLocaleString()}</div>
                <div className="text-xs text-blue-600">YTD Sales</div>
                <div className="text-xs text-blue-700">₹{item.metrics.ytdNetSales.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-800">{item.metrics.liquidation.volume.toLocaleString()}</div>
                <div className="text-xs text-green-600">Liquidation</div>
                <div className="text-xs text-green-700">₹{item.metrics.liquidation.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-800">{item.metrics.balanceStock.volume.toLocaleString()}</div>
                <div className="text-xs text-purple-600">Balance Stock</div>
                <div className="text-xs text-purple-700">₹{item.metrics.balanceStock.value.toFixed(2)}L</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Liquidation Progress</span>
                <span>{item.metrics.liquidationPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(item.metrics.liquidationPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.region} • {item.zone}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Updated: {new Date(item.metrics.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button 
                onClick={() => handleVerifyClick(item)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Stock
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Verification Modal */}
      {showVerifyModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Stock Verification</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedItem.distributorName} ({selectedItem.distributorCode})</p>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">SKU-wise Stock Verification</h4>
                <div className="space-y-6">
                  {getSKUData(selectedItem.id).map((sku) => (
                    <div key={sku.skuCode} className="bg-gray-50 rounded-xl p-4">
                      {/* SKU Header */}
                      <div className="mb-4">
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">{sku.skuName}</h5>
                        <p className="text-sm text-gray-600">SKU Code: {sku.skuCode}</p>
                      </div>
                      
                      {/* Invoice-wise verification */}
                      <div className="space-y-3">
                        {sku.invoices.map((invoice) => {
                          const verificationKey = `${sku.skuCode}-${invoice.invoiceNumber}`;
                          const variance = (verificationData.skuVerifications[verificationKey]?.variance || 0);
                          
                          return (
                            <div key={invoice.invoiceNumber} className="bg-white rounded-lg border border-gray-200 p-4">
                              {/* Invoice Info */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900">Invoice: {invoice.invoiceNumber}</p>
                                  <p className="text-xs text-gray-500">Batch: {invoice.batchNumber}</p>
                                </div>
                                <p className="text-xs text-gray-500">Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                              </div>
                              
                              {/* Single line layout: SKU Name - Current Stock - Physical Stock */}
                              <div className="flex items-center space-x-6">
                                {/* Current Stock */}
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Current Stock (System)</p>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="number"
                                      value={verificationData.skuVerifications[verificationKey]?.current || invoice.currentStock}
                                      onChange={(e) => handleSKUStockChange(sku.skuCode, invoice.invoiceNumber, 'current', parseInt(e.target.value) || 0)}
                                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                                      placeholder="0"
                                    />
                                    <span className="text-sm text-gray-600">{sku.unit}</span>
                                  </div>
                                </div>
                                
                                {/* Physical Stock */}
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Physical Stock (Verified)</p>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="number"
                                      value={verificationData.skuVerifications[verificationKey]?.physical || ''}
                                      onChange={(e) => handleSKUStockChange(sku.skuCode, invoice.invoiceNumber, 'physical', parseInt(e.target.value) || 0)}
                                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                                      placeholder="Enter count"
                                    />
                                    <span className="text-sm text-gray-600">{sku.unit}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Variance Display */}
                              {variance !== 0 && (
                                <div className={`mt-3 p-3 rounded-lg ${
                                  variance > 0 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-red-50 border border-red-200'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Variance:</span>
                                    <span className={`font-bold ${
                                      variance > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {variance > 0 ? '+' : ''}{variance} {sku.unit}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* SKU Total Summary */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-900">SKU Total:</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-600">
                              System: {sku.invoices.reduce((sum, inv) => sum + inv.currentStock, 0)} {sku.unit}
                            </span>
                            <span className="text-gray-600">
                              Physical: {sku.invoices.reduce((sum, inv) => {
                                const key = `${sku.skuCode}-${inv.invoiceNumber}`;
                                return sum + (verificationData.skuVerifications[key]?.physical || 0);
                              }, 0)} {sku.unit}
                            </span>
                            <span className={`font-bold ${
                              sku.invoices.reduce((sum, inv) => {
                                const key = `${sku.skuCode}-${inv.invoiceNumber}`;
                                return sum + (verificationData.skuVerifications[key]?.variance || 0);
                              }, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              Variance: {sku.invoices.reduce((sum, inv) => {
                                const key = `${sku.skuCode}-${inv.invoiceNumber}`;
                                return sum + (verificationData.skuVerifications[key]?.variance || 0);
                              }, 0)} {sku.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Remarks Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Remarks
                  </label>
                  <textarea
                    value={verificationData.remarks}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, remarks: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add any remarks about the stock verification..."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifySubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Verify Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No liquidation data found</p>
        </div>
      )}
    </div>
  );
};

export default Liquidation;