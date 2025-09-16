import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, TrendingUp, Users, Droplets, Eye, Edit, CheckCircle, AlertTriangle, Search, Filter, Download, Plus, Building, MapPin, Calendar, Phone, DollarSign, Target, BarChart3, Activity, Zap, Award, Clock, X, Save, Camera, FileText, FileSignature as Signature, Shield, ChevronRight, Minus, AlertCircle as Alert, UserPlus, Store } from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

interface ProductSKU {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  skuCode: string;
  skuName: string;
  unit: string;
  lastBalance: number;
  currentStock: number;
  difference: number;
  isVerified: boolean;
  soldTo?: 'retailer' | 'farmer';
  retailerDetails?: RetailerDetail[];
  farmerQuantity?: number;
}

interface RetailerDetail {
  id: string;
  name: string;
  code?: string;
  phone?: string;
  address?: string;
  isNew: boolean;
  quantity: number;
}

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
  const [verificationStep, setVerificationStep] = useState<'overview' | 'stock-entry' | 'difference-tracking' | 'signature'>('overview');
  const [viewType, setViewType] = useState<'opening' | 'ytd' | 'liquidation' | 'balance'>('opening');
  const [productSKUs, setProductSKUs] = useState<ProductSKU[]>([]);
  const [pendingProducts, setPendingProducts] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);
  const [retailerCount, setRetailerCount] = useState(1);
  const [newRetailer, setNewRetailer] = useState({ name: '', phone: '', address: '' });

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

  // Sample Product & SKU data for verification
  const initializeProductSKUs = () => {
    return [
      {
        id: '1',
        productId: 'P001',
        productName: 'DAP (Di-Ammonium Phosphate)',
        productCode: 'FERT001',
        skuCode: 'DAP-25KG',
        skuName: 'DAP 25kg Bag',
        unit: 'Kg',
        lastBalance: 150,
        currentStock: 120,
        difference: 30,
        isVerified: false
      },
      {
        id: '2',
        productId: 'P001',
        productName: 'DAP (Di-Ammonium Phosphate)',
        productCode: 'FERT001',
        skuCode: 'DAP-50KG',
        skuName: 'DAP 50kg Bag',
        unit: 'Kg',
        lastBalance: 100,
        currentStock: 85,
        difference: 15,
        isVerified: false
      },
      {
        id: '3',
        productId: 'P002',
        productName: 'Urea',
        productCode: 'UREA001',
        skuCode: 'UREA-25KG',
        skuName: 'Urea 25kg Bag',
        unit: 'Kg',
        lastBalance: 80,
        currentStock: 80,
        difference: 0,
        isVerified: false
      },
      {
        id: '4',
        productId: 'P003',
        productName: 'NPK Complex',
        productCode: 'NPK001',
        skuCode: 'NPK-25KG',
        skuName: 'NPK Complex 25kg Bag',
        unit: 'Kg',
        lastBalance: 60,
        currentStock: 45,
        difference: 15,
        isVerified: false
      }
    ];
  };

  const handleView = (distributorId: string, type: 'opening' | 'ytd' | 'liquidation' | 'balance') => {
    setSelectedDistributor(distributorId);
    setViewType(type);
    setShowViewModal(true);
  };

  const handleVerify = (distributorId: string) => {
    setSelectedDistributor(distributorId);
    setProductSKUs(initializeProductSKUs());
    setVerificationStep('overview');
    setPendingProducts(4); // Total number of SKUs
    setShowVerifyModal(true);
  };


  const handleGetSignature = (distributorId: string) => {
    console.log(`Get signature for distributor: ${distributorId}`);
    // Add signature functionality
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowVerifyModal(false);
    setVerificationStep('overview');
    setSelectedDistributor(null);
    setProductSKUs([]);
    setPendingProducts(0);
    setShowAlert(false);
    setSelectedSKU(null);
  };

  const updateCurrentStock = (skuId: string, value: number) => {
    setProductSKUs(prev => prev.map(sku => {
      if (sku.id === skuId) {
        const difference = sku.lastBalance - value;
        return {
          ...sku,
          currentStock: value,
          difference,
          isVerified: true
        };
      }
      return sku;
    }));
    
    // Update pending count
    const remaining = productSKUs.filter(sku => sku.id !== skuId && !sku.isVerified).length;
    setPendingProducts(remaining);
  };

  const proceedToNextStep = () => {
    const unverified = productSKUs.filter(sku => !sku.isVerified);
    if (unverified.length > 0) {
      setShowAlert(true);
      return;
    }
    
    const hasChanges = productSKUs.some(sku => sku.difference !== 0);
    if (hasChanges) {
      setVerificationStep('difference-tracking');
    } else {
      setVerificationStep('signature');
    }
  };

  const handleSoldToSelection = (skuId: string, soldTo: 'retailer' | 'farmer') => {
    setProductSKUs(prev => prev.map(sku => 
      sku.id === skuId ? { ...sku, soldTo } : sku
    ));
    setSelectedSKU(skuId);
  };

  const addRetailerDetail = (skuId: string) => {
    const sku = productSKUs.find(s => s.id === skuId);
    if (!sku) return;
    
    setProductSKUs(prev => prev.map(s => {
      if (s.id === skuId) {
        const retailerDetails = s.retailerDetails || [];
        return {
          ...s,
          retailerDetails: [...retailerDetails, {
            id: Date.now().toString(),
            name: newRetailer.name || `Retailer ${retailerDetails.length + 1}`,
            phone: newRetailer.phone,
            address: newRetailer.address,
            isNew: !newRetailer.phone, // Assume new if no phone provided
            quantity: 0
          }]
        };
      }
      return s;
    }));
    
    setNewRetailer({ name: '', phone: '', address: '' });
  };

  const updateRetailerQuantity = (skuId: string, retailerId: string, quantity: number) => {
    setProductSKUs(prev => prev.map(sku => {
      if (sku.id === skuId && sku.retailerDetails) {
        return {
          ...sku,
          retailerDetails: sku.retailerDetails.map(retailer =>
            retailer.id === retailerId ? { ...retailer, quantity } : retailer
          )
        };
      }
      return sku;
    }));
  };

  const updateFarmerQuantity = (skuId: string, quantity: number) => {
    setProductSKUs(prev => prev.map(sku => 
      sku.id === skuId ? { ...sku, farmerQuantity: quantity } : sku
    ));
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
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-orange-800 mb-2">Opening Stock</h4>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-900 mb-1">32,660</div>
            <div className="text-sm text-orange-700 mb-2">Kg/Litre</div>
            <div className="text-lg font-semibold text-orange-800">₹190.00L</div>
          </div>
        </div>

        <div 
          className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-blue-800 mb-2">YTD Net Sales</h4>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-1">13,303</div>
            <div className="text-sm text-blue-700 mb-2">Kg/Litre</div>
            <div className="text-lg font-semibold text-blue-800">₹43.70L</div>
          </div>
        </div>

        <div 
          className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-green-800 mb-2">Liquidation</h4>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-900 mb-1">12,720</div>
            <div className="text-sm text-green-700 mb-2">Kg/Litre</div>
            <div className="text-lg font-semibold text-green-800">₹55.52L</div>
          </div>
        </div>

        <div 
          className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-purple-800 mb-2">Balance Stock</h4>
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
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Stock Verification - {getSelectedDistributor()?.distributorName}
              </h3>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Alert for Pending Products */}
              {showAlert && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <div className="flex items-center">
                    <Alert className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">
                      There are {pendingProducts} Products & SKUs pending as per stock balance
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAlert(false)}
                    className="mt-2 text-red-600 text-sm underline"
                  >
                    Continue anyway
                  </button>
                </div>
              )}

              {/* Step 1: Overview */}
              {verificationStep === 'overview' && (
                <div className="space-y-6">
                  {/* Total Stats */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Total Statistics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-orange-100 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">390</div>
                        <div className="text-sm text-orange-700">Total Last Balance</div>
                      </div>
                      <div className="text-center p-4 bg-blue-100 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {productSKUs.reduce((sum, sku) => sum + sku.currentStock, 0)}
                        </div>
                        <div className="text-sm text-blue-700">Current Stock</div>
                      </div>
                      <div className="text-center p-4 bg-green-100 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {productSKUs.reduce((sum, sku) => sum + Math.abs(sku.difference), 0)}
                        </div>
                        <div className="text-sm text-green-700">Total Difference</div>
                      </div>
                      <div className="text-center p-4 bg-purple-100 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {productSKUs.filter(sku => sku.isVerified).length}/{productSKUs.length}
                        </div>
                        <div className="text-sm text-purple-700">Verified</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setVerificationStep('stock-entry')}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Product & SKU Verification
                  </button>
                </div>
              )}

              {/* Step 2: Stock Entry */}
              {verificationStep === 'stock-entry' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Product & SKU wise Stock Verification</h4>
                    <div className="text-sm text-gray-600">
                      Progress: {productSKUs.filter(sku => sku.isVerified).length}/{productSKUs.length}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {productSKUs.map((sku) => (
                      <div key={sku.id} className={`border rounded-lg p-4 ${sku.isVerified ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h5 className="font-semibold text-gray-900">{sku.productName}</h5>
                            <p className="text-sm text-gray-600">{sku.skuName} ({sku.skuCode})</p>
                          </div>
                          {sku.isVerified && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-orange-100 rounded-lg">
                            <div className="text-lg font-bold text-orange-800">{sku.lastBalance}</div>
                            <div className="text-xs text-orange-600">Last Balance (ERP)</div>
                          </div>
                          <div className="text-center p-3 bg-blue-100 rounded-lg">
                            <input
                              type="number"
                              value={sku.currentStock}
                              onChange={(e) => updateCurrentStock(sku.id, parseInt(e.target.value) || 0)}
                              className="w-full text-center text-lg font-bold bg-transparent border-none outline-none text-blue-800"
                              placeholder="Enter current stock"
                            />
                            <div className="text-xs text-blue-600">Current Stock</div>
                          </div>
                          <div className="text-center p-3 bg-gray-100 rounded-lg">
                            <div className={`text-lg font-bold ${sku.difference > 0 ? 'text-red-800' : sku.difference < 0 ? 'text-green-800' : 'text-gray-800'}`}>
                              {sku.difference > 0 ? '+' : ''}{sku.difference}
                            </div>
                            <div className="text-xs text-gray-600">Difference</div>
                          </div>
                          <div className="text-center p-3 bg-purple-100 rounded-lg">
                            <div className="text-lg font-bold text-purple-800">{sku.unit}</div>
                            <div className="text-xs text-purple-600">Unit</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setVerificationStep('overview')}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={proceedToNextStep}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Difference Tracking */}
              {verificationStep === 'difference-tracking' && (
                <div className="space-y-6">
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">📋 Stock Reduction Tracking Required</h4>
                    <p className="text-blue-800 text-sm">
                      We detected stock reductions. Please specify where this stock went to maintain accurate liquidation tracking.
                    </p>
                  </div>
                  
                  {productSKUs.filter(sku => sku.difference !== 0).map((sku) => (
                    <div key={sku.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h5 className="font-semibold text-gray-900">{sku.productName}</h5>
                          <p className="text-sm text-gray-600">{sku.skuName}</p>
                          <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-red-800 font-semibold">
                              📉 Stock Reduced: {Math.abs(sku.difference)} {sku.unit}
                            </p>
                            <p className="text-red-600 text-sm">
                              Last Balance: {sku.lastBalance} → Current: {sku.currentStock}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Where did this stock go? */}
                      <div className="mb-6">
                        <h6 className="font-medium text-gray-900 mb-3">🤔 Where did this {Math.abs(sku.difference)} {sku.unit} stock go?</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div 
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              sku.soldTo === 'retailer' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                            }`}
                            onClick={() => handleSoldToSelection(sku.id, 'retailer')}
                          >
                            <div className="flex items-center">
                              <Store className="w-6 h-6 text-blue-600 mr-3" />
                              <div>
                                <h6 className="font-medium text-gray-900">🏪 SOLD to Retailer</h6>
                                <p className="text-sm text-gray-600">Stock reassigned → NOT liquidation</p>
                                <p className="text-xs text-blue-600 font-medium">Need retailer details & tracking</p>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              sku.soldTo === 'farmer' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                            }`}
                            onClick={() => handleSoldToSelection(sku.id, 'farmer')}
                          >
                            <div className="flex items-center">
                              <Users className="w-6 h-6 text-green-600 mr-3" />
                              <div>
                                <h6 className="font-medium text-gray-900">🌾 SOLD to Farmer</h6>
                                <p className="text-sm text-gray-600">Direct liquidation ✅</p>
                                <p className="text-xs text-green-600 font-medium">Adds to liquidation count</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Retailer Details */}
                      {sku.soldTo === 'retailer' && (
                        <div className="bg-blue-50 rounded-lg p-6 mb-4 border border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h6 className="font-medium text-blue-900">🏪 Retailer Assignment Details</h6>
                            <button
                              onClick={() => addRetailerDetail(sku.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
                            >
                              <UserPlus className="w-3 h-3 mr-1" />
                              Add Retailer
                            </button>
                          </div>
                          
                          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4">
                            <p className="text-blue-800 text-sm font-medium">
                              📝 Total to assign: {Math.abs(sku.difference)} {sku.unit}
                            </p>
                            <p className="text-blue-700 text-xs mt-1">
                              ⚠️ This stock will be reassigned to retailers and tracked for liquidation
                            </p>
                          </div>
                          
                          {/* New Retailer Form */}
                          <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
                            <h6 className="font-medium text-gray-900 mb-3">Add New Retailer</h6>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                placeholder="Retailer Name *"
                                value={newRetailer.name}
                                onChange={(e) => setNewRetailer(prev => ({ ...prev, name: e.target.value }))}
                                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="text"
                                placeholder="Phone (optional)"
                                value={newRetailer.phone}
                                onChange={(e) => setNewRetailer(prev => ({ ...prev, phone: e.target.value }))}
                                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="text"
                                placeholder="Address (optional)"
                                value={newRetailer.address}
                                onChange={(e) => setNewRetailer(prev => ({ ...prev, address: e.target.value }))}
                                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                           {/* Retailer List */}
                          {sku.retailerDetails && sku.retailerDetails.length > 0 && (
                            <div className="space-y-3">
                              <h6 className="font-medium text-gray-900">📋 Retailer Assignments</h6>
                              {sku.retailerDetails.map((retailer) => (
                                <div key={retailer.id} className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <h6 className="font-medium text-gray-900">{retailer.name}</h6>
                                      {retailer.phone && <p className="text-sm text-gray-600">{retailer.phone}</p>}
                                      {retailer.address && <p className="text-sm text-gray-600">📍 {retailer.address}</p>}
                                      <div className="flex items-center space-x-2 mt-1">
                                        {retailer.isNew && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">🆕 New</span>}
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                          📅 Added: {new Date().toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Assigned Quantity:</span>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        placeholder="0"
                                        value={retailer.quantity}
                                        onChange={(e) => updateRetailerQuantity(sku.id, retailer.id, parseInt(e.target.value) || 0)}
                                        max={Math.abs(sku.difference)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      />
                                      <span className="text-sm text-gray-600">{sku.unit}</span>
                                    </div>
                                  </div>
                                  {retailer.quantity > 0 && (
                                    <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                                      <p className="text-green-800 text-xs">
                                        ✅ Will be tracked for liquidation | Last updated: {new Date().toLocaleString()}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-blue-800 font-medium">Total Assigned:</span>
                                  <span className="text-blue-900 font-bold">
                                    {sku.retailerDetails.reduce((sum, r) => sum + r.quantity, 0)} / {Math.abs(sku.difference)} {sku.unit}
                                  </span>
                                </div>
                                {sku.retailerDetails.reduce((sum, r) => sum + r.quantity, 0) === Math.abs(sku.difference) && (
                                  <p className="text-green-700 text-sm mt-1">✅ All stock assigned!</p>
                                )}
                                {sku.retailerDetails.reduce((sum, r) => sum + r.quantity, 0) < Math.abs(sku.difference) && (
                                  <p className="text-orange-700 text-sm mt-1">
                                    ⚠️ Remaining: {Math.abs(sku.difference) - sku.retailerDetails.reduce((sum, r) => sum + r.quantity, 0)} {sku.unit}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm font-medium">📋 Pending Task Generated:</p>
                            <p className="text-yellow-700 text-xs mt-1">
                              • Retailer liquidation tracking notifications will be created<br/>
                              • MDO will receive follow-up tasks to track farmer sales from these retailers<br/>
                              • Stock reassignment will be logged with date/time stamps
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Farmer Details */}
                      {sku.soldTo === 'farmer' && (
                        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                          <h6 className="font-medium text-green-900 mb-4">🌾 Farmer Sale Details</h6>
                          
                          <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
                            <p className="text-green-800 text-sm font-medium">
                              📝 Total sold to farmers: {Math.abs(sku.difference)} {sku.unit}
                            </p>
                            <p className="text-green-700 text-xs mt-1">
                              ✅ This will be added directly to liquidation count
                            </p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <label className="block text-sm font-medium text-green-700 mb-2">Confirm quantity sold to farmers:</label>
                            <div className="flex items-center space-x-4">
                              <input
                                type="number"
                                value={sku.farmerQuantity || Math.abs(sku.difference)}
                                onChange={(e) => updateFarmerQuantity(sku.id, parseInt(e.target.value) || 0)}
                                max={Math.abs(sku.difference)}
                                className="w-32 px-3 py-2 border border-green-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                              <span className="text-sm text-green-600">{sku.unit}</span>
                              <span className="text-xs text-gray-500">(Max: {Math.abs(sku.difference)})</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                            <p className="text-green-800 text-sm font-medium">📊 Liquidation Impact:</p>
                            <p className="text-green-700 text-xs mt-1">
                              • Tagged as "Distributor Farmer Liquidation"<br/>
                              • Added to total liquidation count immediately<br/>
                              • Logged with date/time stamp: {new Date().toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <button
                      onClick={() => setVerificationStep('stock-entry')}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setVerificationStep('signature')}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Continue to Verification
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Signature/Verification */}
              {verificationStep === 'signature' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Verification & Signature</h4>
                  
                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h5 className="font-semibold text-gray-900 mb-4">Verification Summary</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h6 className="font-medium text-gray-700 mb-2">Products Verified</h6>
                        <div className="space-y-2">
                          {productSKUs.map((sku) => (
                            <div key={sku.id} className="flex justify-between text-sm">
                              <span>{sku.skuName}</span>
                              <span className={sku.difference === 0 ? 'text-green-600' : 'text-orange-600'}>
                                {sku.difference === 0 ? 'No Change' : `${Math.abs(sku.difference)} ${sku.unit} ${sku.soldTo}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-gray-700 mb-2">Audit Trail</h6>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Date: {new Date().toLocaleDateString()}</p>
                          <p>Time: {new Date().toLocaleTimeString()}</p>
                          <p>Verified by: Rajesh Kumar (MDO001)</p>
                          <p>Distributor: {getSelectedDistributor()?.distributorName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Options */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900">Choose Verification Method</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-6 cursor-pointer">
                        <div className="text-center">
                          <Signature className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                          <h6 className="font-semibold text-gray-900 mb-2">E-Signature</h6>
                          <p className="text-sm text-gray-600">Digital signature verification</p>
                        </div>
                      </div>
                      
                      <div className="border-2 border-gray-200 hover:border-green-300 rounded-lg p-6 cursor-pointer">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-green-600 mx-auto mb-3" />
                          <h6 className="font-semibold text-gray-900 mb-2">Letterhead Declaration</h6>
                          <p className="text-sm text-gray-600">Upload signed letterhead</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Alert className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <h6 className="font-medium text-yellow-800">Pending Tasks Generated</h6>
                        <div className="text-sm text-yellow-700 mt-1">
                          {productSKUs.filter(sku => sku.soldTo === 'retailer').length > 0 && (
                            <p>• Retailer liquidation tracking notifications have been created</p>
                          )}
                          <p>• Stock verification completed and logged for audit</p>
                          <p>• All changes tagged with timestamp and user details</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setVerificationStep('difference-tracking')}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        alert('Stock verification completed successfully!\n\nAudit trail created with:\n- Date & Time stamp\n- User details\n- All stock changes\n- Retailer assignments\n- Farmer liquidations');
                        closeModals();
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Verification
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidation;