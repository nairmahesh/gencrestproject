import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  TrendingUp, 
  Users, 
  Calendar,
  MapPin,
  Phone,
  Building,
  CheckCircle,
  AlertTriangle,
  Edit,
  Save,
  X,
  Plus,
  Minus
} from 'lucide-react';

interface RetailerLiquidationData {
  id: string;
  retailerId: string;
  retailerCode: string;
  retailerName: string;
  distributorId: string;
  distributorName: string;
  productId: string;
  productName: string;
  productCode: string;
  skuCode: string;
  skuName: string;
  unit: string;
  assignedStock: number;
  currentStock: number;
  liquidatedStock: number;
  assignedValue: number;
  currentValue: number;
  liquidatedValue: number;
  billingDate: string;
  lastUpdated: string;
  updatedBy: string;
  hasSignature: boolean;
  hasMedia: boolean;
  territory: string;
  region: string;
  zone: string;
  assignedMDO?: string;
  assignedTSM?: string;
  liquidationPercentage: number;
  targetLiquidation: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Overdue';
  priority: 'High' | 'Medium' | 'Low';
  daysOverdue: number;
  remarks?: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
}

const RetailerLiquidation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Sample data - in real app this would come from API
  const [liquidationData, setLiquidationData] = useState<RetailerLiquidationData>({
    id: id || '1',
    retailerId: 'RET001',
    retailerCode: 'GAS001',
    retailerName: 'Green Agro Store',
    distributorId: 'DIST001',
    distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
    productId: 'P001',
    productName: 'DAP (Di-Ammonium Phosphate)',
    productCode: 'FERT001',
    skuCode: 'DAP-25KG',
    skuName: 'DAP 25kg Bag',
    unit: 'Kg',
    assignedStock: 50,
    currentStock: 35,
    liquidatedStock: 15,
    assignedValue: 0.60,
    currentValue: 0.42,
    liquidatedValue: 0.18,
    billingDate: '2024-01-15',
    lastUpdated: '2024-01-20',
    updatedBy: 'MDO001',
    hasSignature: false,
    hasMedia: false,
    territory: 'North Delhi',
    region: 'Delhi NCR',
    zone: 'North Zone',
    assignedMDO: 'MDO001',
    assignedTSM: 'TSM001',
    liquidationPercentage: 30,
    targetLiquidation: 50,
    status: 'Active',
    priority: 'High',
    daysOverdue: 5,
    remarks: 'Stock verification pending',
    approvalStatus: 'Pending',
    approvedBy: undefined,
    approvedDate: undefined
  });

  const [editingStock, setEditingStock] = useState(false);
  const [tempCurrentStock, setTempCurrentStock] = useState(liquidationData.currentStock);
  const [originalStock, setOriginalStock] = useState(liquidationData.currentStock);
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'farmer' | 'retailer' | ''>('');
  const [retailerCount, setRetailerCount] = useState(3);
  const [retailers, setRetailers] = useState([
    { id: '1', name: 'Retailer 1', assignedQty: 0, soldQty: 0 },
    { id: '2', name: 'Retailer 2', assignedQty: 0, soldQty: 0 },
    { id: '3', name: 'Retailer 3', assignedQty: 0, soldQty: 0 }
  ]);
  const [farmerQty, setFarmerQty] = useState(0);

  const stockDifference = originalStock - tempCurrentStock;

  const handleEditStock = () => {
    setOriginalStock(liquidationData.currentStock);
    setTempCurrentStock(liquidationData.currentStock);
    setEditingStock(true);
  };

  const handleSaveStock = () => {
    const difference = originalStock - tempCurrentStock;
    
    if (difference > 0) {
      // Stock was reduced - show modal
      setShowModal(true);
      setTransactionType('');
      setFarmerQty(0);
      setRetailers(retailers.map(r => ({ ...r, assignedQty: 0, soldQty: 0 })));
    } else {
      // Stock was increased or same - just save
      setLiquidationData(prev => ({
        ...prev,
        currentStock: tempCurrentStock,
        currentValue: (tempCurrentStock / prev.assignedStock) * prev.assignedValue,
        lastUpdated: new Date().toISOString()
      }));
      setEditingStock(false);
    }
  };

  const handleCancelEdit = () => {
    setTempCurrentStock(originalStock);
    setEditingStock(false);
  };

  const handleTransactionTypeChange = (type: 'farmer' | 'retailer') => {
    setTransactionType(type);
    if (type === 'farmer') {
      setFarmerQty(stockDifference);
    }
  };

  const handleRetailerCountChange = (count: number) => {
    setRetailerCount(count);
    const newRetailers = [];
    for (let i = 0; i < count; i++) {
      const existingRetailer = retailers[i];
      newRetailers.push(existingRetailer || {
        id: (i + 1).toString(),
        name: `Retailer ${i + 1}`,
        assignedQty: 0,
        soldQty: 0
      });
    }
    setRetailers(newRetailers);
  };

  const handleRetailerChange = (index: number, field: 'assignedQty' | 'soldQty', value: number) => {
    setRetailers(prev => 
      prev.map((retailer, i) => 
        i === index ? { ...retailer, [field]: value } : retailer
      )
    );
  };

  const handleModalSave = () => {
    const totalAssigned = retailers.slice(0, retailerCount).reduce((sum, r) => sum + r.assignedQty, 0);
    const totalSold = retailers.slice(0, retailerCount).reduce((sum, r) => sum + r.soldQty, 0);
    
    if (transactionType === 'retailer') {
      if (totalAssigned !== stockDifference) {
        alert(`Total assigned (${totalAssigned}) must equal stock difference (${stockDifference})`);
        return;
      }
    }
    
    // Update liquidation data
    let newLiquidatedStock = liquidationData.liquidatedStock;
    if (transactionType === 'farmer') {
      newLiquidatedStock += farmerQty;
    } else if (transactionType === 'retailer') {
      newLiquidatedStock += totalSold; // Only sold qty counts as liquidation
    }
    
    setLiquidationData(prev => ({
      ...prev,
      currentStock: tempCurrentStock,
      liquidatedStock: newLiquidatedStock,
      liquidationPercentage: Math.round((newLiquidatedStock / prev.assignedStock) * 100),
      currentValue: (tempCurrentStock / prev.assignedStock) * prev.assignedValue,
      liquidatedValue: (newLiquidatedStock / prev.assignedStock) * prev.assignedValue,
      lastUpdated: new Date().toISOString()
    }));
    
    setShowModal(false);
    setEditingStock(false);
  };

  const getTotalAssigned = () => retailers.slice(0, retailerCount).reduce((sum, r) => sum + r.assignedQty, 0);
  const getTotalSold = () => retailers.slice(0, retailerCount).reduce((sum, r) => sum + r.soldQty, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-700 bg-green-100';
      case 'Pending': return 'text-yellow-700 bg-yellow-100';
      case 'Completed': return 'text-blue-700 bg-blue-100';
      case 'Overdue': return 'text-red-700 bg-red-100';
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
            onClick={() => navigate('/liquidation')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Retailer Liquidation Details</h1>
            <p className="text-gray-600 mt-1">Track and manage retailer stock liquidation</p>
          </div>
        </div>
      </div>

      {/* Retailer Info Card */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{liquidationData.retailerName}</h2>
              <p className="text-gray-600">{liquidationData.retailerCode}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(liquidationData.status)}`}>
              {liquidationData.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(liquidationData.priority)}`}>
              {liquidationData.priority}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <div>
              <p className="font-medium">Territory: {liquidationData.territory}</p>
              <p>Region: {liquidationData.region}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <div>
              <p className="font-medium">MDO: {liquidationData.assignedMDO}</p>
              <p>TSM: {liquidationData.assignedTSM}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <div>
              <p className="font-medium">Billing: {new Date(liquidationData.billingDate).toLocaleDateString()}</p>
              <p>Updated: {new Date(liquidationData.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Card */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{liquidationData.productName}</h4>
              <p className="text-gray-600">{liquidationData.skuName} ({liquidationData.skuCode})</p>
              <p className="text-sm text-gray-500">Last Updated: {new Date(liquidationData.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assigned Stock */}
            <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-800 mb-1">{liquidationData.assignedStock}</div>
              <div className="text-sm text-orange-600 mb-2">{liquidationData.unit}</div>
              <div className="text-sm font-semibold text-orange-700">₹{liquidationData.assignedValue.toFixed(2)}L</div>
              <div className="text-xs text-orange-600 mt-1">Assigned</div>
            </div>

            {/* Current Stock */}
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                {editingStock ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setTempCurrentStock(Math.max(0, tempCurrentStock - 1))}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={tempCurrentStock}
                      onChange={(e) => setTempCurrentStock(parseInt(e.target.value) || 0)}
                      className="w-16 text-center text-xl font-bold text-blue-800 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={() => setTempCurrentStock(tempCurrentStock + 1)}
                      className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-blue-800">{liquidationData.currentStock}</div>
                )}
              </div>
              <div className="text-sm text-blue-600 mb-2">{liquidationData.unit}</div>
              <div className="text-sm font-semibold text-blue-700">₹{liquidationData.currentValue.toFixed(2)}L</div>
              <div className="text-xs text-blue-600 mt-1">Current Stock</div>
              
              {editingStock ? (
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleSaveStock}
                    className="flex-1 bg-green-600 text-white py-1 px-3 rounded-lg text-sm hover:bg-green-700 flex items-center justify-center"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-600 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditStock}
                  className="mt-3 bg-blue-600 text-white py-1 px-3 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center mx-auto"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Update Stock
                </button>
              )}
            </div>

            {/* Liquidated Stock */}
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">{liquidationData.liquidatedStock}</div>
              <div className="text-sm text-green-600 mb-2">{liquidationData.unit}</div>
              <div className="text-sm font-semibold text-green-700">₹{liquidationData.liquidatedValue.toFixed(2)}L</div>
              <div className="text-xs text-green-600 mt-1">Liquidated</div>
            </div>
          </div>

          {/* Liquidation Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Liquidation Progress</span>
              <span>{liquidationData.liquidationPercentage}% (Target: {liquidationData.targetLiquidation}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (liquidationData.liquidationPercentage / liquidationData.targetLiquidation) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>Target: {liquidationData.targetLiquidation}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Reduction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Liquidated to whom?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {liquidationData.productName} - Quantity: {stockDifference} {liquidationData.unit}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* 🐛 RED DEBUG SECTION - ALWAYS VISIBLE */}
              <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-6">
                <h5 className="text-lg font-semibold text-red-800 mb-2">🐛 DEBUG INFO - ALWAYS VISIBLE</h5>
                <div className="text-sm space-y-1">
                  <p>Transaction Type: <strong>{transactionType || 'NONE SELECTED'}</strong></p>
                  <p>Stock Difference: <strong>{stockDifference}</strong></p>
                  <p>Modal Open: <strong>{showModal ? 'YES' : 'NO'}</strong></p>
                  <p>Retailer Count: <strong>{retailerCount}</strong></p>
                  <p>Product Name: <strong>{liquidationData.productName}</strong></p>
                  <p>SKU Code: <strong>{liquidationData.skuCode}</strong></p>
                </div>
              </div>

              {/* 🧪 YELLOW RETAILER BREAKDOWN - ALWAYS VISIBLE */}
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 mb-6">
                <h5 className="text-lg font-semibold text-yellow-800 mb-4">🧪 RETAILER BREAKDOWN - ALWAYS VISIBLE</h5>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-yellow-700">How many retailers?</span>
                  <select
                    value={retailerCount}
                    onChange={(e) => handleRetailerCountChange(parseInt(e.target.value))}
                    className="px-3 py-1 border border-yellow-300 rounded-lg"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-4">
                  {retailers.slice(0, retailerCount).map((retailer, index) => (
                    <div key={retailer.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                      <h6 className="font-semibold text-gray-900 mb-3">Retailer {index + 1}</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assigned QTY
                          </label>
                          <input
                            type="number"
                            value={retailer.assignedQty}
                            onChange={(e) => handleRetailerChange(index, 'assignedQty', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter assigned quantity"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sold QTY
                          </label>
                          <input
                            type="number"
                            value={retailer.soldQty}
                            onChange={(e) => handleRetailerChange(index, 'soldQty', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter sold quantity"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DEBUG SECTION - ALWAYS VISIBLE */}
              <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-6">
                <h5 className="text-lg font-semibold text-red-800 mb-2">🐛 DEBUG INFO - ALWAYS VISIBLE</h5>
                <div className="text-sm space-y-1">
                  <p>Transaction Type: <strong>{transactionType || 'NONE SELECTED'}</strong></p>
                  <p>Stock Difference: <strong>{stockDifference}</strong></p>
                  <p>Modal Open: <strong>{showModal ? 'YES' : 'NO'}</strong></p>
                  <p>Retailer Count: <strong>{retailerCount}</strong></p>
                  <p>Product Name: <strong>{liquidationData.productName}</strong></p>
                  <p>SKU Code: <strong>{liquidationData.skuCode}</strong></p>
                </div>
              </div>

              {/* Transaction Type Selection */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Transaction Type</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      transactionType === 'farmer' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => handleTransactionTypeChange('farmer')}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Sold to Farmer</h5>
                      <p className="text-sm text-gray-600">Direct liquidation</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      transactionType === 'retailer' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleTransactionTypeChange('retailer')}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-blue-600" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Sold to Retailer</h5>
                      <p className="text-sm text-gray-600">Requires retailer details</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RETAILER BREAKDOWN - ALWAYS VISIBLE */}
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 mb-6">
                <h5 className="text-lg font-semibold text-yellow-800 mb-4">🧪 RETAILER BREAKDOWN - ALWAYS VISIBLE</h5>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-yellow-700">How many retailers?</span>
                  <select
                    value={retailerCount}
                    onChange={(e) => handleRetailerCountChange(parseInt(e.target.value))}
                    className="px-3 py-1 border border-yellow-300 rounded-lg"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-4">
                  {retailers.slice(0, retailerCount).map((retailer, index) => (
                    <div key={retailer.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                      <h6 className="font-semibold text-gray-900 mb-3">Retailer {index + 1}</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assigned QTY
                          </label>
                          <input
                            type="number"
                            value={retailer.assignedQty}
                            onChange={(e) => handleRetailerChange(index, 'assignedQty', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter assigned quantity"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sold QTY
                          </label>
                          <input
                            type="number"
                            value={retailer.soldQty}
                            onChange={(e) => handleRetailerChange(index, 'soldQty', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter sold quantity"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farmer Details */}
              {transactionType === 'farmer' && (
                <div className="bg-green-50 rounded-xl p-6 mb-6">
                  <h5 className="text-lg font-semibold text-green-800 mb-4">Farmer Sale Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">
                        Quantity Sold to Farmers
                      </label>
                      <input
                        type="number"
                        value={farmerQty}
                        onChange={(e) => setFarmerQty(parseInt(e.target.value) || 0)}
                        max={stockDifference}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="text-sm text-green-600">
                        <p>Max: {stockDifference} {liquidationData.unit}</p>
                        <p className="font-semibold">This counts as liquidation</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Retailer Details - CONDITIONAL */}
              {transactionType === 'retailer' && (
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-blue-800">Retailer Distribution Details - CONDITIONAL</h5>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-blue-700">How many retailers?</label>
                      <select
                        value={retailerCount}
                        onChange={(e) => handleRetailerCountChange(parseInt(e.target.value))}
                        className="px-3 py-1 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {retailers.slice(0, retailerCount).map((retailer, index) => (
                      <div key={retailer.id} className="bg-white rounded-lg p-4 border border-blue-200">
                        <h6 className="font-semibold text-gray-900 mb-3">Retailer {index + 1}</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Assigned QTY
                            </label>
                            <input
                              type="number"
                              value={retailer.assignedQty}
                              onChange={(e) => handleRetailerChange(index, 'assignedQty', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter assigned quantity"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sold QTY
                            </label>
                            <input
                              type="number"
                              value={retailer.soldQty}
                              onChange={(e) => handleRetailerChange(index, 'soldQty', parseInt(e.target.value) || 0)}
                              max={retailer.assignedQty}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter sold quantity"
                            />
                          </div>
                        </div>
                        {retailer.soldQty > retailer.assignedQty && (
                          <p className="text-red-600 text-sm mt-2">
                            ⚠️ Sold quantity cannot exceed assigned quantity
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {transactionType && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Summary</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stockDifference}</div>
                      <div className="text-sm text-gray-600">Stock Reduction</div>
                    </div>
                    
                    {transactionType === 'farmer' && (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{farmerQty}</div>
                          <div className="text-sm text-gray-600">Sold to Farmers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{farmerQty}</div>
                          <div className="text-sm text-gray-600">Liquidation Count</div>
                        </div>
                      </>
                    )}
                    
                    {transactionType === 'retailer' && (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{getTotalAssigned()}</div>
                          <div className="text-sm text-gray-600">Total Assigned</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{getTotalSold()}</div>
                          <div className="text-sm text-gray-600">Liquidation Count</div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {transactionType === 'retailer' && getTotalAssigned() !== stockDifference && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                      <p className="text-red-800 text-sm">
                        ⚠️ Total assigned ({getTotalAssigned()}) must equal stock difference ({stockDifference})
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                disabled={!transactionType}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Information */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Approval Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                liquidationData.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                liquidationData.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {liquidationData.approvalStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Days Overdue:</span>
              <span className={`font-semibold ${liquidationData.daysOverdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {liquidationData.daysOverdue > 0 ? `${liquidationData.daysOverdue} days` : 'On time'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Has Signature:</span>
              <span className={`font-semibold ${liquidationData.hasSignature ? 'text-green-600' : 'text-red-600'}`}>
                {liquidationData.hasSignature ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Has Media:</span>
              <span className={`font-semibold ${liquidationData.hasMedia ? 'text-green-600' : 'text-red-600'}`}>
                {liquidationData.hasMedia ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Track Liquidation
            </button>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Edit className="w-4 h-4 mr-2" />
              Update Stock
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
              <Save className="w-4 h-4 mr-2" />
              Get Signature
            </button>
          </div>
        </div>
      </div>

      {/* Remarks */}
      {liquidationData.remarks && (
        <div className="bg-white rounded-xl p-6 card-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h3>
          <p className="text-gray-700">{liquidationData.remarks}</p>
        </div>
      )}
    </div>
  );
};

export default RetailerLiquidation;