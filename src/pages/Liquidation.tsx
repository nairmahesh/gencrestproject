import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, TrendingUp, Users, Droplets, Eye, Edit, CheckCircle, AlertTriangle, Search, Filter, Download, Plus, Building, MapPin, Calendar, Phone, DollarSign, Target, BarChart3, Activity, Zap, Award, Clock, X, Save, Camera, FileText, FileSignature as Signature, Shield, ChevronRight } from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

interface DistributorEntry {
  id: string;
  distributorName: string;
  distributorCode: string;
  products: string;
  territory: string;
  region: string;
  zone: string;
  openingStock: { volume: number; value: number };
  ytdNetSales: { volume: number; value: number };
  liquidation: { volume: number; value: number };
  balanceStock: { volume: number; value: number };
  liquidationPercentage: number;
  status: 'Active' | 'Pending';
  priority: 'High' | 'Medium' | 'Low';
  remarks?: string;
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [viewType, setViewType] = useState<'opening' | 'ytd' | 'liquidation' | 'balance'>('opening');

  const [distributorEntries] = useState<DistributorEntry[]>([
    {
      id: '1',
      distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
      distributorCode: '1325',
      products: 'DAP (Di-Ammonium Phosphate)',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      openingStock: { volume: 40, value: 13.80 },
      ytdNetSales: { volume: 32, value: 13.95 },
      liquidation: { volume: 140, value: 9.30 },
      balanceStock: { volume: 210, value: 18.45 },
      liquidationPercentage: 40,
      status: 'Active',
      priority: 'High',
      remarks: 'Good progress on liquidation'
    },
    {
      id: '2',
      distributorName: 'Ram Kumar Distributors',
      distributorCode: 'DLR001',
      products: 'Multiple Products',
      territory: 'South Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      openingStock: { volume: 80, value: 18.75 },
      ytdNetSales: { volume: 65, value: 8.13 },
      liquidation: { volume: 62, value: 7.75 },
      balanceStock: { volume: 83, value: 19.13 },
      liquidationPercentage: 29,
      status: 'Pending',
      priority: 'Medium',
      remarks: 'Needs follow-up'
    }
  ]);

  const handleView = (distributorId: string, type: 'opening' | 'ytd' | 'liquidation' | 'balance') => {
    setSelectedDistributor(distributorId);
    setViewType(type);
    setShowViewModal(true);
  };

  const handleVerify = (distributorId: string) => {
    setSelectedDistributor(distributorId);
    setShowVerifyModal(true);
  };

  const handleGetSignature = (distributorId: string) => {
    console.log(`Get signature for distributor: ${distributorId}`);
    // Add signature functionality
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowVerifyModal(false);
    setSelectedDistributor(null);
  };

  const getSelectedDistributor = () => {
    return distributorEntries.find(d => d.id === selectedDistributor);
  };

  const getViewData = () => {
    const distributor = getSelectedDistributor();
    if (!distributor) return null;

    switch (viewType) {
      case 'opening':
        return {
          title: 'Opening Stock Details',
          data: {
            volume: distributor.openingStock.volume,
            value: distributor.openingStock.value,
            breakdown: 'Product & SKU wise opening stock breakdown for ' + distributor.distributorName
          }
        };
      case 'ytd':
        return {
          title: 'YTD Net Sales Details',
          data: {
            volume: distributor.ytdNetSales.volume,
            value: distributor.ytdNetSales.value,
            breakdown: 'Product & SKU wise sales performance for ' + distributor.distributorName
          }
        };
      case 'liquidation':
        return {
          title: 'Liquidation Details',
          data: {
            volume: distributor.liquidation.volume,
            value: distributor.liquidation.value,
            breakdown: 'Product & SKU wise liquidation breakdown for ' + distributor.distributorName
          }
        };
      case 'balance':
        return {
          title: 'Balance Stock Details',
          data: {
            volume: distributor.balanceStock.volume,
            value: distributor.balanceStock.value,
            breakdown: 'Product & SKU wise remaining stock for ' + distributor.distributorName
          }
        };
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-700 bg-green-100';
      case 'Pending': return 'text-yellow-700 bg-yellow-100';
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
            <h1 className="text-2xl font-bold text-gray-900">Liquidation</h1>
            <p className="text-gray-600 mt-1">Track and manage distributor stock liquidation</p>
          </div>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          className="bg-orange-50 rounded-xl p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleView('1', 'opening')}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-orange-800">Opening Stock</h4>
            <button className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700">
              View
            </button>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-900 mb-1">32,660</div>
            <div className="text-sm text-orange-700 mb-2">Kg/Litre</div>
            <div className="text-lg font-semibold text-orange-800">₹190.00L</div>
          </div>
        </div>

        <div 
          className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleView('1', 'ytd')}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-blue-800">YTD Net Sales</h4>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
              View
            </button>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-1">13,303</div>
            <div className="text-sm text-blue-700 mb-2">Kg/Litre</div>
            <div className="text-lg font-semibold text-blue-800">₹43.70L</div>
          </div>
        </div>

        <div 
          className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleView('1', 'liquidation')}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-green-800">Liquidation</h4>
            <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
              View
            </button>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900 mb-1">12,720</div>
            <div className="text-sm text-green-700 mb-2">Kg/Litre</div>
            <div className="text-lg font-semibold text-green-800">₹55.52L</div>
          </div>
        </div>

        <div 
          className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleView('1', 'balance')}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-purple-800">Balance Stock</h4>
            <button 
              className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700"
              onClick={(e) => {
                e.stopPropagation();
                handleVerify('1');
              }}
            >
              Verify
            </button>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-900 mb-1">33,243</div>
            <div className="text-sm text-purple-700 mb-2">Kg/Litre</div>
            <div className="text-lg font-semibold text-purple-800">₹178.23L</div>
          </div>
        </div>
      </div>

      {/* Distributor Entries */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Distributor Entries</h3>
        {distributorEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{entry.distributorName}</h3>
                  <p className="text-sm text-gray-600">Code: {entry.distributorCode} | {entry.products}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Distributor
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(entry.status)}`}>
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  {entry.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(entry.priority)}`}>
                  {entry.priority}
                </span>
              </div>
            </div>

            {/* Stock Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Opening Stock */}
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-orange-800">Opening Stock</h4>
                  <button 
                    onClick={() => handleView(entry.id, 'opening')}
                    className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700"
                  >
                    View
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-orange-700">Volume</div>
                  <div className="text-2xl font-bold text-orange-900">{entry.openingStock.volume}</div>
                  <div className="text-sm text-orange-700">Value</div>
                  <div className="text-lg font-semibold text-orange-800">₹{entry.openingStock.value.toFixed(2)}L</div>
                </div>
              </div>

              {/* YTD Net Sales */}
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-blue-800">YTD Net Sales</h4>
                  <button 
                    onClick={() => handleView(entry.id, 'ytd')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    View
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-blue-700">Volume</div>
                  <div className="text-2xl font-bold text-blue-900">{entry.ytdNetSales.volume}</div>
                  <div className="text-sm text-blue-700">Value</div>
                  <div className="text-lg font-semibold text-blue-800">₹{entry.ytdNetSales.value.toFixed(2)}L</div>
                </div>
              </div>

              {/* Liquidation */}
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-green-800">Liquidation</h4>
                  <button 
                    onClick={() => handleView(entry.id, 'liquidation')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                  >
                    View
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-green-700">Volume</div>
                  <div className="text-2xl font-bold text-green-900">{entry.liquidation.volume}</div>
                  <div className="text-sm text-green-700">Value</div>
                  <div className="text-lg font-semibold text-green-800">₹{entry.liquidation.value.toFixed(2)}L</div>
                </div>
              </div>

              {/* Balance Stock */}
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-purple-800">Balance Stock</h4>
                  <button 
                    onClick={() => handleVerify(entry.id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700"
                  >
                    Verify
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-purple-700">Volume</div>
                  <div className="text-2xl font-bold text-purple-900">{entry.balanceStock.volume}</div>
                  <div className="text-sm text-purple-700">Value</div>
                  <div className="text-lg font-semibold text-purple-800">₹{entry.balanceStock.value.toFixed(2)}L</div>
                </div>
              </div>
            </div>

            {/* Liquidation Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-semibold text-gray-900">% Liquidation</span>
                <span className="text-2xl font-bold text-purple-600">{entry.liquidationPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${entry.liquidationPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Remarks */}
            {entry.remarks && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Remarks: </span>
                <span className="text-sm text-gray-600">{entry.remarks}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View Modal */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {getViewData()?.title}
              </h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {getViewData() && (
                <div>
                  {/* Distributor Info */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {getSelectedDistributor()?.distributorName}
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>Code: {getSelectedDistributor()?.distributorCode}</p>
                      <p>Type: Distributor</p>
                    </div>
                  </div>
                  
                  {/* Volume and Value */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <h5 className="text-sm font-medium text-blue-700 mb-2">Volume</h5>
                      <div className="text-3xl font-bold text-blue-900 mb-1">
                        {getViewData()!.data.volume.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">Kg/Litre</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <h5 className="text-sm font-medium text-green-700 mb-2">Value</h5>
                      <div className="text-3xl font-bold text-green-900 mb-1">
                        ₹{getViewData()!.data.value.toFixed(2)}L
                      </div>
                      <div className="text-sm text-green-600">Indian Lakhs</div>
                    </div>
                  </div>
                  
                  {/* Product & SKU Breakdown */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Product & SKU Breakdown</h5>
                    <p className="text-sm text-gray-600 mb-4">
                      {getViewData()!.data.breakdown}
                    </p>
                    
                    {/* Sample SKU Data */}
                    <div className="space-y-3">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h6 className="font-medium text-gray-900">DAP 25kg Bag</h6>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            DAP-25KG
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Volume: </span>
                            <span className="font-semibold">15,000 Kg</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Value: </span>
                            <span className="font-semibold">₹18.75L</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h6 className="font-medium text-gray-900">DAP 50kg Bag</h6>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            DAP-50KG
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Volume: </span>
                            <span className="font-semibold">10,000 Kg</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Value: </span>
                            <span className="font-semibold">₹12.50L</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Liquidated to whom?
              </h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  DAP 25kg Bag - Quantity: 9 Kg
                </p>
                
                {/* Transaction Type Selection */}
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Transaction Type</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-6 rounded-xl border-2 border-gray-200 hover:border-green-300 cursor-pointer transition-all">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Sold to Farmer</h5>
                      <p className="text-sm text-gray-600">Direct liquidation</p>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl border-2 border-blue-500 bg-blue-50 cursor-pointer transition-all">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-blue-600" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Sold to Retailer</h5>
                      <p className="text-sm text-gray-600">Requires retailer details</p>
                    </div>
                  </div>
                </div>
                
                {/* SKU Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">SKU Details</h5>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Original Qty</div>
                      <div className="text-2xl font-bold text-orange-600">35</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">New Qty</div>
                      <div className="text-2xl font-bold text-blue-600">26</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">To be Liquidated</div>
                      <div className="text-2xl font-bold text-green-600">9</div>
                    </div>
                  </div>
                </div>
                
                {/* Quantity Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={closeModals}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Liquidation details saved!');
                  closeModals();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidation;