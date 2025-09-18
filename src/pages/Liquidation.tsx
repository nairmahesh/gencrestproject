import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  TrendingUp, 
  Droplets, 
  Target,
  Building,
  Search,
  Filter,
  Eye,
  CheckCircle,
  X,
  ChevronRight
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  
  const { 
    overallMetrics, 
    distributorMetrics, 
    getPerformanceMetrics 
  } = useLiquidationCalculation();

  const handleVerifyClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setShowVerifyModal(true);
  };

  const getSKUData = (distributorId: string) => {
    return [
      {
        skuCode: 'DAP-25KG',
        skuName: 'DAP 25kg Bag',
        unit: 'Kg',
        invoices: [
          {
            invoiceNumber: 'INV-2024-001',
            invoiceDate: '2024-01-15',
            currentStock: 105,
            batchNumber: 'BATCH-001'
          },
          {
            invoiceNumber: 'INV-2024-002', 
            invoiceDate: '2024-01-15',
            currentStock: 105,
            batchNumber: 'BATCH-002'
          }
        ]
      },
      {
        skuCode: 'DAP-50KG',
        skuName: 'DAP 50kg Bag',
        unit: 'Kg',
        invoices: [
          {
            invoiceNumber: 'INV-2024-001',
            invoiceDate: '2024-01-15',
            currentStock: 105,
            batchNumber: 'BATCH-003'
          },
          {
            invoiceNumber: 'INV-2024-002',
            invoiceDate: '2024-01-15',
            currentStock: 105,
            batchNumber: 'BATCH-004'
          }
        ]
      }
    ];
  };

  const filteredDistributors = distributorMetrics.filter(distributor => {
    const matchesSearch = distributor.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distributor.distributorCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || distributor.status === selectedStatus;
    return matchesSearch && matchesStatus;
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

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Opening Stock</h4>
          <div className="text-3xl font-bold text-gray-900 mb-1">{overallMetrics.openingStock.volume.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-gray-500 mb-3">Value: ₹{overallMetrics.openingStock.value.toFixed(2)}L</div>
          <button className="text-orange-600 text-sm font-medium hover:text-orange-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <div className="text-xs text-gray-500 mt-2">Last updated: 15 Sept 2025, 10:00 pm</div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">YTD Net Sales</h4>
          <div className="text-3xl font-bold text-gray-900 mb-1">{overallMetrics.ytdNetSales.volume.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-gray-500 mb-3">Value: ₹{overallMetrics.ytdNetSales.value.toFixed(2)}L</div>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <div className="text-xs text-gray-500 mt-2">Last updated: 15 Sept 2025, 10:00 pm</div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation</h4>
          <div className="text-3xl font-bold text-gray-900 mb-1">{overallMetrics.liquidation.volume.toLocaleString()}</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-gray-500 mb-3">Value: ₹{overallMetrics.liquidation.value.toFixed(2)}L</div>
          <button className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <div className="text-xs text-gray-500 mt-2">Last updated: Jan 20, 2024</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation Rate</h4>
          <div className="text-3xl font-bold text-gray-900 mb-1">{overallMetrics.liquidationPercentage}%</div>
          <div className="text-sm text-gray-600 mb-2">Overall</div>
          <div className="text-sm text-gray-500 mb-3">Performance</div>
          <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <div className="text-xs text-gray-500 mt-2">Last updated: Jan 20, 2024</div>
        </div>
      </div>

      {/* Summary Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg p-4 card-shadow">
        <span>Showing {filteredDistributors.length} of {distributorMetrics.length} distributors</span>
        <div className="flex items-center space-x-4">
          <span>Active: {distributorMetrics.filter(d => d.status === 'Active').length}</span>
          <span>High Priority: {distributorMetrics.filter(d => d.priority === 'High').length}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search distributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Distributors List */}
      <div className="space-y-4">
        {filteredDistributors.map((distributor) => (
          <div key={distributor.id} className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{distributor.distributorName}</h3>
                  <p className="text-gray-600">{distributor.distributorCode} • {distributor.territory}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Distributor
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  distributor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {distributor.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  distributor.priority === 'High' ? 'bg-red-100 text-red-800' :
                  distributor.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {distributor.priority}
                </span>
              </div>
            </div>

            {/* Distributor Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                <div className="text-sm text-orange-600 mb-1">Opening Stock</div>
                <div className="text-xl font-bold text-orange-800">{distributor.metrics.openingStock.volume}</div>
                <div className="text-xs text-orange-600">{distributor.metrics.openingStock.value.toFixed(2)}L</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">YTD Sales</div>
                <div className="text-xl font-bold text-blue-800">{distributor.metrics.ytdNetSales.volume}</div>
                <div className="text-xs text-blue-600">{distributor.metrics.ytdNetSales.value.toFixed(2)}L</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <div className="text-sm text-green-600 mb-1">Liquidation</div>
                <div className="text-xl font-bold text-green-800">{distributor.metrics.liquidation.volume}</div>
                <div className="text-xs text-green-600">{distributor.metrics.liquidation.value.toFixed(2)}L</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                <div className="text-sm text-purple-600 mb-1">Rate</div>
                <div className="text-xl font-bold text-purple-800">{distributor.metrics.liquidationPercentage}%</div>
                <div className="text-xs text-purple-600">Performance</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Liquidation Progress</span>
                <span>{distributor.metrics.liquidationPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${distributor.metrics.liquidationPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Location and Update Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-4">
                <span>{distributor.region} • {distributor.zone}</span>
                <span>Updated: {new Date(distributor.metrics.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button 
                onClick={() => handleVerifyClick(distributor)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Stock
              </button>
            </div>

            {/* Remarks */}
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Remarks:</span> Good progress on liquidation
            </div>
          </div>
        ))}
      </div>

      {/* Stock Verification Modal */}
      {showVerifyModal && selectedDistributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Blue Header */}
            <div className="bg-blue-100 p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedDistributor.distributorName}</h3>
                  <p className="text-sm text-gray-600">{selectedDistributor.distributorCode} • {selectedDistributor.territory}</p>
                </div>
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">SKU-wise Stock Verification</h4>
              
              <div className="space-y-8">
                {getSKUData(selectedDistributor.id).map((sku) => (
                  <div key={sku.skuCode}>
                    {/* SKU Header */}
                    <div className="mb-4">
                      <h5 className="text-lg font-semibold text-gray-900">{sku.skuName}</h5>
                      {sku.skuCode !== 'DAP-25KG' && (
                        <p className="text-sm text-gray-600">SKU: {sku.skuCode}</p>
                      )}
                    </div>
                    
                    {/* Column Headers */}
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div></div>
                      <div className="text-center">
                        <h6 className="font-semibold text-gray-900">Current Stock (System)</h6>
                      </div>
                      <div className="text-center">
                        <h6 className="font-semibold text-gray-900">Physical Stock (Verified)</h6>
                      </div>
                    </div>
                    
                    {/* Invoice Rows */}
                    <div className="space-y-3">
                      {sku.invoices.map((invoice, index) => (
                        <div key={`${sku.skuCode}-${invoice.invoiceNumber}`} className="grid grid-cols-3 gap-6 items-center py-3 border-b border-gray-200">
                          {/* Invoice Details */}
                          <div>
                            <p className="font-medium text-gray-900">Invoice: {invoice.invoiceNumber}</p>
                            <p className="text-sm text-gray-600">Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                          </div>
                          
                          {/* Current Stock */}
                          <div className="text-center">
                            <input
                              type="number"
                              value={invoice.currentStock}
                              readOnly
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
                            />
                          </div>
                          
                          {/* Physical Stock */}
                          <div className="text-center">
                            <input
                              type="number"
                              placeholder="105"
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
                onClick={() => {
                  alert(`Stock verified for ${selectedDistributor.distributorName}!`);
                  setShowVerifyModal(false);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Verify Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidation;