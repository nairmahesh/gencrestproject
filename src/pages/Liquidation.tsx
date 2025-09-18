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
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);

  const { 
    overallMetrics, 
    distributorMetrics, 
    getPerformanceMetrics
  } = useLiquidationCalculation();

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric);
    setShowDetailModal(true);
  };

  const handleVerifyClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setShowVerifyModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-700 bg-green-100';
      case 'Inactive': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-700 bg-red-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
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
            <p className="text-gray-600 mt-1">Monitor and track stock liquidation across distributors</p>
          </div>
        </div>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleMetricClick('opening')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Opening Stock</h4>
          <div className="text-3xl font-bold text-gray-900 mb-1">32,660</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-gray-500 mb-3">Value: ₹190.00L</div>
          <button className="text-orange-600 text-sm font-medium hover:text-orange-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <div className="text-xs text-gray-500 mt-2">Last updated: 15 Sept 2025, 10:00 pm</div>
        </div>

        <div 
          className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleMetricClick('sales')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">YTD Net Sales</h4>
          <div className="text-3xl font-bold text-gray-900 mb-1">13,303</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-gray-500 mb-3">Value: ₹43.70L</div>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <div className="text-xs text-gray-500 mt-2">Last updated: 15 Sept 2025, 10:00 pm</div>
        </div>

        <div 
          className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleMetricClick('liquidation')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation</h4>
          <div className="text-3xl font-bold text-gray-900 mb-1">12,720</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-gray-500 mb-3">Value: ₹55.52L</div>
          <button className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <div className="text-xs text-gray-500 mt-2">Last updated: 15 Sept 2025, 10:00 pm</div>
        </div>

        <div 
          className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleMetricClick('rate')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation Rate</h4>
          <div className="text-3xl font-bold text-gray-900 mb-1">28%</div>
          <div className="text-sm text-gray-600 mb-2">Overall</div>
          <div className="text-sm text-gray-500 mb-3">Performance</div>
          <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </button>
          <div className="text-xs text-gray-500 mt-2">Last updated: 15 Sept 2025, 10:00 pm</div>
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
                placeholder="Search distributors, codes, territories..."
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

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {filteredDistributors.length} of {distributorMetrics.length} distributors</span>
        <div className="flex items-center space-x-4">
          <span>Active: {distributorMetrics.filter(d => d.status === 'Active').length}</span>
          <span>High Priority: {distributorMetrics.filter(d => d.priority === 'High').length}</span>
        </div>
      </div>

      {/* Distributor Cards */}
      <div className="space-y-4">
        {filteredDistributors.map((distributor) => (
          <div key={distributor.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{distributor.distributorName}</h3>
                  <p className="text-sm text-gray-600">{distributor.distributorCode} • {distributor.territory}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Distributor
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(distributor.status)}`}>
                  {distributor.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(distributor.priority)}`}>
                  {distributor.priority}
                </span>
              </div>
            </div>

            {/* Distributor Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-800">{distributor.metrics.openingStock.volume}</div>
                <div className="text-sm text-orange-600">Opening Stock</div>
                <div className="text-xs text-orange-700">₹{distributor.metrics.openingStock.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">{distributor.metrics.ytdNetSales.volume}</div>
                <div className="text-sm text-blue-600">YTD Sales</div>
                <div className="text-xs text-blue-700">₹{distributor.metrics.ytdNetSales.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-800">{distributor.metrics.liquidation.volume}</div>
                <div className="text-sm text-green-600">Liquidation</div>
                <div className="text-xs text-green-700">₹{distributor.metrics.liquidation.value.toFixed(2)}L</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-800">{distributor.metrics.liquidationPercentage}%</div>
                <div className="text-sm text-purple-600">Liquidation Rate</div>
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
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {distributor.region} • {distributor.zone}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Updated: 9/18/2025
                </span>
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
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Remarks:</span> Good progress on liquidation
              </p>
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
            
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">SKU-wise Stock Verification</h4>
              
              <div className="space-y-6">
                {/* DAP 25kg Bag */}
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">DAP 25kg Bag</h5>
                  
                  <div className="space-y-3">
                    {/* Invoice 1 */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div>
                        <p className="font-medium text-gray-900">Invoice: INV-2024-001</p>
                        <p className="text-sm text-gray-600">Date: 1/15/2024</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Current Stock (System)</p>
                        <input
                          type="number"
                          value={105}
                          readOnly
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Physical Stock (Verified)</p>
                        <input
                          type="number"
                          placeholder="105"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Invoice 2 */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div>
                        <p className="font-medium text-gray-900">Invoice: INV-2024-002</p>
                        <p className="text-sm text-gray-600">Date: 1/20/2024</p>
                      </div>
                      <div className="text-center">
                        <input
                          type="number"
                          value={105}
                          readOnly
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="number"
                          placeholder="105"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DAP 50kg Bag */}
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">DAP 50kg Bag</h5>
                  
                  <div className="space-y-3">
                    {/* Invoice 1 */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div>
                        <p className="font-medium text-gray-900">Invoice: INV-2024-001</p>
                        <p className="text-sm text-gray-600">Date: 1/15/2024</p>
                      </div>
                      <div className="text-center">
                        <input
                          type="number"
                          value={105}
                          readOnly
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="number"
                          placeholder="105"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Invoice 2 */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div>
                        <p className="font-medium text-gray-900">Invoice: INV-2024-002</p>
                        <p className="text-sm text-gray-600">Date: 1/20/2024</p>
                      </div>
                      <div className="text-center">
                        <input
                          type="number"
                          value={105}
                          readOnly
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
                        />
                      </div>
                      <div className="text-center">
                        <input
                          type="number"
                          placeholder="105"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                  placeholder="Add verification remarks..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
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