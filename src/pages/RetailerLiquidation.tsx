import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, Phone, CheckCircle, Clock, AlertTriangle, FileSignature as Signature, Save, Eye, Building, Target, TrendingUp, Users, ShoppingCart, Info, Boxes, X, Plus, Calendar } from 'lucide-react';
import { SignatureCapture } from '../components/SignatureCapture';

interface RetailerStock {
  skuCode: string;
  skuName: string;
  unit: string;
  assignedQuantity: number;
  currentStock: number;
  liquidatedToFarmer: number;
  returnToDistributor: number;
  assignedDate: string;
  unitPrice: number;
  totalValue: number;
}

interface BalanceTransaction {
  id: string;
  recipientType: 'Retailer' | 'Farmer';
  recipientName: string;
  recipientCode?: string;
  recipientPhone: string;
  recipientAddress: string;
  quantity: number;
  date: string;
  value: number;
  notes: string;
}

interface RetailerLiquidationData {
  id: string;
  retailerId: string;
  retailerCode: string;
  retailerName: string;
  retailerPhone: string;
  retailerAddress: string;
  distributorId: string;
  distributorName: string;
  distributorCode: string;
  
  stockDetails: RetailerStock[];
  balanceTransactions: BalanceTransaction[];
  
  liquidationStatus: 'Assigned' | 'Partially Liquidated' | 'Fully Liquidated' | 'Stock Returned';
  hasRetailerSignature: boolean;
  lastVisitDate?: string;
  lastVisitBy?: string;
  
  totalAssignedValue: number;
  totalLiquidatedValue: number;
  liquidationPercentage: number;
}

const RetailerLiquidation: React.FC = () => {
  const navigate = useNavigate();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [stockUpdateData, setStockUpdateData] = useState<{[key: string]: {current: number, liquidated: number, returned: number}}>({});
  const [activeTab, setActiveTab] = useState<'contact' | 'stock'>('contact');
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    recipientType: 'Retailer' as 'Retailer' | 'Farmer',
    recipientName: '',
    recipientCode: '',
    recipientPhone: '',
    recipientAddress: '',
    quantity: 0,
    notes: ''
  });

  // Sample data for retailer liquidation
  const [retailerData, setRetailerData] = useState<RetailerLiquidationData>({
    id: 'RL001',
    retailerId: 'RET001',
    retailerCode: 'A001',
    retailerName: 'Green Agro Store',
    retailerPhone: '+91 98765 11111',
    retailerAddress: 'Market Road, Agricultural Zone, Sector 15',
    distributorId: 'DIST001',
    distributorName: 'SRI RAMA SEEDS AND PESTICIDES',
    distributorCode: '1325',
    
    stockDetails: [
      {
        skuCode: 'NPK-50KG',
        skuName: 'NPK Fertilizer 50kg Bag',
        unit: 'Kg',
        assignedQuantity: 40,
        currentStock: 20,
        liquidatedToFarmer: 0,
        returnToDistributor: 0,
        assignedDate: '2024-01-15',
        unitPrice: 1200,
        totalValue: 48000
      },
      {
        skuCode: 'PEST-1L',
        skuName: 'Organic Pesticide 1L Bottle',
        unit: 'Litre',
        assignedQuantity: 25,
        currentStock: 15,
        liquidatedToFarmer: 0,
        returnToDistributor: 0,
        assignedDate: '2024-01-15',
        unitPrice: 450,
        totalValue: 11250
      }
    ],
    
    balanceTransactions: [
      {
        id: 'BT001',
        recipientType: 'Retailer',
        recipientName: 'Sunrise Agro Center',
        recipientCode: 'RET002',
        recipientPhone: '+91 98765 22222',
        recipientAddress: 'Main Street, Agricultural Hub',
        quantity: 15,
        date: '2024-01-18',
        value: 18000,
        notes: 'Emergency stock transfer due to high demand'
      },
      {
        id: 'BT002',
        recipientType: 'Farmer',
        recipientName: 'Rajesh Kumar',
        recipientPhone: '+91 98765 33333',
        recipientAddress: 'Village Greenfield, District North',
        quantity: 5,
        date: '2024-01-19',
        value: 6000,
        notes: 'Direct sale to large farmer'
      }
    ],
    
    liquidationStatus: 'Assigned',
    hasRetailerSignature: false,
    lastVisitDate: '2024-01-20',
    lastVisitBy: 'MDO001',
    
    totalAssignedValue: 59250,
    totalLiquidatedValue: 0,
    liquidationPercentage: 40
  });

  // Calculate real-time metrics based on stock updates
  const calculateRealTimeMetrics = () => {
    const totalAssigned = retailerData.stockDetails.reduce((sum, item) => sum + item.assignedQuantity, 0);
    const totalCurrent = retailerData.stockDetails.reduce((sum, item) => 
      sum + (stockUpdateData[item.skuCode]?.current ?? item.currentStock), 0);
    const totalLiquidated = retailerData.stockDetails.reduce((sum, item) => 
      sum + (stockUpdateData[item.skuCode]?.liquidated ?? item.liquidatedToFarmer), 0);
    const totalReturned = retailerData.stockDetails.reduce((sum, item) => 
      sum + (stockUpdateData[item.skuCode]?.returned ?? item.returnToDistributor), 0);
    
    // Correct liquidation calculation: liquidated out of total available stock
    const liquidationRate = totalAssigned > 0 ? Math.round(((totalLiquidated + totalReturned) / totalAssigned) * 100) : 0;
    const balanceStock = totalCurrent;
    
    // Calculate values (assuming average unit price for simplification)
    const avgUnitPrice = retailerData.stockDetails.reduce((sum, item) => sum + item.unitPrice, 0) / retailerData.stockDetails.length;
    const openingValue = (totalAssigned * avgUnitPrice) / 100000; // Convert to Lakhs
    const currentValue = (totalCurrent * avgUnitPrice) / 100000;
    const liquidatedValue = (totalLiquidated * avgUnitPrice) / 100000;
    const balanceValue = (balanceStock * avgUnitPrice) / 100000;
    
    return {
      totalAssigned,
      totalCurrent,
      totalLiquidated,
      totalReturned,
      balanceStock,
      liquidationRate,
      openingValue,
      currentValue,
      liquidatedValue,
      balanceValue
    };
  };

  const metrics = calculateRealTimeMetrics();

  const handleStockUpdate = (skuCode: string, field: 'current' | 'liquidated' | 'returned', value: number) => {
    setStockUpdateData(prev => ({
      ...prev,
      [skuCode]: {
        ...prev[skuCode],
        current: prev[skuCode]?.current ?? retailerData.stockDetails.find(s => s.skuCode === skuCode)?.currentStock ?? 0,
        liquidated: prev[skuCode]?.liquidated ?? retailerData.stockDetails.find(s => s.skuCode === skuCode)?.liquidatedToFarmer ?? 0,
        returned: prev[skuCode]?.returned ?? retailerData.stockDetails.find(s => s.skuCode === skuCode)?.returnToDistributor ?? 0,
        [field]: value
      }
    }));
  };

  const handleTrackLiquidation = () => {
    // Navigate to detailed liquidation tracking view
    alert('Navigating to detailed liquidation tracking view with farmer-wise breakdown...');
    // In real app: navigate('/liquidation-tracking/' + retailerData.id);
  };

  const handleUpdateStock = async () => {
    setIsUpdatingStock(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the actual stock data
      const updatedStockDetails = retailerData.stockDetails.map(stock => {
        const updates = stockUpdateData[stock.skuCode];
        if (updates) {
          return {
            ...stock,
            currentStock: updates.current,
            liquidatedToFarmer: updates.liquidated,
            returnToDistributor: updates.returned
          };
        }
        return stock;
      });

      setRetailerData(prev => ({
        ...prev,
        stockDetails: updatedStockDetails
      }));
      
      // Show success message
      alert('Stock quantities updated successfully!');
      
      // Clear the update data since it's now saved
      setStockUpdateData({});
      
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    }
    
    setIsUpdatingStock(false);
  };

  const handleGetSignature = () => {
    setShowSignatureModal(true);
  };

  const handleSignatureSave = (signature: string) => {
    console.log('Retailer signature saved:', signature);
    // Update retailer data to show signature is captured
    setRetailerData(prev => ({
      ...prev,
      hasRetailerSignature: true
    }));
    setShowSignatureModal(false);
    alert('Retailer signature captured and saved successfully.');
  };

  const handleAddTransaction = () => {
    if (!newTransaction.recipientName || !newTransaction.recipientPhone || newTransaction.quantity <= 0) {
      alert('Please fill all required fields');
      return;
    }

    const transaction: BalanceTransaction = {
      id: `BT${Date.now()}`,
      ...newTransaction,
      date: new Date().toISOString().split('T')[0],
      value: newTransaction.quantity * 1200 // Assuming average price
    };

    setRetailerData(prev => ({
      ...prev,
      balanceTransactions: [...prev.balanceTransactions, transaction]
    }));

    // Reset form
    setNewTransaction({
      recipientType: 'Retailer',
      recipientName: '',
      recipientCode: '',
      recipientPhone: '',
      recipientAddress: '',
      quantity: 0,
      notes: ''
    });

    setShowAddTransactionModal(false);
    alert('Transaction added successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned':
        return 'text-blue-700 bg-blue-100';
      case 'Partially Liquidated':
        return 'text-yellow-700 bg-yellow-100';
      case 'Fully Liquidated':
        return 'text-green-700 bg-green-100';
      case 'Stock Returned':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Assigned':
        return <Package className="w-4 h-4" />;
      case 'Partially Liquidated':
        return <Clock className="w-4 h-4" />;
      case 'Fully Liquidated':
        return <CheckCircle className="w-4 h-4" />;
      case 'Stock Returned':
        return <ArrowLeft className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Calculate balance stock that needs explanation
  const calculateMissingStock = () => {
    const totalAssigned = retailerData.stockDetails.reduce((sum, item) => sum + item.assignedQuantity, 0);
    const totalCurrent = retailerData.stockDetails.reduce((sum, item) => sum + item.currentStock, 0);
    const totalTransacted = retailerData.balanceTransactions.reduce((sum, transaction) => sum + transaction.quantity, 0);
    
    return Math.max(0, totalAssigned - totalCurrent - totalTransacted);
  };

  const missingStock = calculateMissingStock();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/liquidation')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Retailer Liquidation Tracking</h1>
            <p className="text-gray-600">Track stock liquidation from retailer to farmer</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Info className="w-4 h-4 mr-2" />
            Contact & Details
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'stock'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Boxes className="w-4 h-4 mr-2" />
            SKU Verification
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Retailer Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-purple-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium text-gray-900">{retailerData.retailerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Code</p>
                        <p className="font-medium text-gray-900">{retailerData.retailerCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{retailerData.retailerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium text-gray-900">{retailerData.retailerAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Territory Information */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Territory Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Assigned by Distributor</p>
                      <p className="font-medium text-blue-800">{retailerData.distributorName}</p>
                      <p className="text-sm text-blue-600">Code: {retailerData.distributorCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Visit</p>
                      <p className="font-medium text-gray-900">{retailerData.lastVisitDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(retailerData.liquidationStatus)}`}>
                        {getStatusIcon(retailerData.liquidationStatus)}
                        <span className="ml-1">{retailerData.liquidationStatus}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Summary */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {retailerData.stockDetails.reduce((sum, item) => sum + item.assignedQuantity, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Assigned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {retailerData.stockDetails.reduce((sum, item) => sum + item.currentStock, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Current Stock</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {retailerData.stockDetails.reduce((sum, item) => sum + item.liquidatedToFarmer, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Liquidated</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{retailerData.liquidationPercentage}%</div>
                    <div className="text-sm text-gray-600">Liquidation Rate</div>
                  </div>
                </div>
              </div>

              {/* Balance Stock Section */}
              {missingStock > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-yellow-800 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Balance Stock Tracking
                    </h3>
                    <button
                      onClick={() => setShowAddTransactionModal(true)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Transaction
                    </button>
                  </div>
                  
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-medium">
                      Missing Stock: {missingStock} units need to be accounted for
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Please record where this stock was distributed (to retailers or farmers)
                    </p>
                  </div>

                  {/* Transaction History */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Transaction History</h4>
                    {retailerData.balanceTransactions.map((transaction) => (
                      <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.recipientType === 'Retailer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {transaction.recipientType}
                            </span>
                            <span className="font-medium text-gray-900">{transaction.recipientName}</span>
                            {transaction.recipientCode && (
                              <span className="text-sm text-gray-500">({transaction.recipientCode})</span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{transaction.quantity} units</div>
                            <div className="text-sm text-gray-500">₹{transaction.value.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {transaction.recipientPhone}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {transaction.recipientAddress && (
                          <div className="mt-2 text-sm text-gray-600 flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                            {transaction.recipientAddress}
                          </div>
                        )}
                        
                        {transaction.notes && (
                          <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            <strong>Notes:</strong> {transaction.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-6">
              {/* Detailed Stock Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-orange-900">{metrics.totalAssigned}</div>
                  <div className="text-sm text-orange-700">Total Assigned</div>
                  <div className="text-xs text-orange-600 mt-1">
                    ₹{metrics.openingValue.toFixed(2)}L
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-900">{metrics.totalCurrent}</div>
                  <div className="text-sm text-yellow-700">Current Stock</div>
                  <div className="text-xs text-yellow-600 mt-1">At Retailer</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-900">{metrics.totalLiquidated}</div>
                  <div className="text-sm text-green-700">Liquidated</div>
                  <div className="text-xs text-green-600 mt-1">To Farmers</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{metrics.balanceStock}</div>
                  <div className="text-sm text-purple-700">Balance Stock</div>
                  <div className="text-xs text-purple-600 mt-1">Remaining</div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center border border-indigo-200">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-900">{metrics.liquidationRate}%</div>
                  <div className="text-sm text-indigo-700">Liquidation Rate</div>
                  <div className="text-xs text-indigo-600 mt-1">Real-time</div>
                </div>
              </div>

              {/* SKU Verification Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Boxes className="w-6 h-6 mr-2 text-purple-600" />
                    Product & SKU Verification
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Update stock quantities and track liquidation progress</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-purple-600">{retailerData.stockDetails.length}</p>
                </div>
              </div>

              {/* SKU Details */}
              <div className="space-y-6">
                {retailerData.stockDetails.map((stock) => (
                  <div key={stock.skuCode} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
                    {/* Product Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{stock.skuName}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded-full">SKU: {stock.skuCode}</span>
                            <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-700">Unit: {stock.unit}</span>
                            <span className="bg-green-100 px-2 py-1 rounded-full text-green-700">₹{stock.unitPrice}/unit</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Assigned Date</p>
                        <p className="font-medium text-gray-900">{new Date(stock.assignedDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Stock Quantities */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      {/* Assigned by Distributor */}
                      <div className="text-center">
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                          <div className="text-xs font-medium text-orange-600 mb-2">ASSIGNED BY DISTRIBUTOR</div>
                          <div className="text-3xl font-bold text-orange-800 mb-1">{stock.assignedQuantity}</div>
                          <div className="text-sm text-orange-600">{stock.unit}</div>
                          <div className="text-xs text-orange-500 mt-2">₹{stock.totalValue.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Current Stock */}
                      <div className="text-center">
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                          <div className="text-xs font-medium text-yellow-600 mb-2">CURRENT STOCK</div>
                          <div className="text-3xl font-bold text-yellow-800 mb-1">
                            {stockUpdateData[stock.skuCode]?.current ?? stock.currentStock}
                          </div>
                          <div className="text-sm text-yellow-600">{stock.unit}</div>
                          <div className="text-xs text-yellow-500 mt-2">(Non-editable)</div>
                        </div>
                      </div>

                      {/* Liquidated to Farmer */}
                      <div className="text-center">
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <div className="text-xs font-medium text-green-600 mb-2">LIQUIDATED TO FARMER</div>
                          <div className="flex items-center justify-center mb-1">
                            <input
                              type="number"
                              value={stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer}
                              onChange={(e) => handleStockUpdate(stock.skuCode, 'liquidated', parseInt(e.target.value) || 0)}
                              className="w-20 text-center text-2xl font-bold text-green-800 bg-transparent border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                              min="0"
                              max={stock.assignedQuantity - (stockUpdateData[stock.skuCode]?.current ?? stock.currentStock)}
                            />
                          </div>
                          <div className="text-sm text-green-600">{stock.unit}</div>
                        </div>
                      </div>

                      {/* Return to Distributor */}
                      <div className="text-center">
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <div className="text-xs font-medium text-purple-600 mb-2">RETURN TO DISTRIBUTOR</div>
                          <div className="flex items-center justify-center mb-1">
                            <input
                              type="number"
                              value={stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor}
                              onChange={(e) => handleStockUpdate(stock.skuCode, 'returned', parseInt(e.target.value) || 0)}
                              className="w-20 text-center text-2xl font-bold text-purple-800 bg-transparent border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                              min="0"
                              max={Math.max(0, stock.assignedQuantity - (stockUpdateData[stock.skuCode]?.current ?? stock.currentStock) - (stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer))}
                            />
                          </div>
                          <div className="text-sm text-purple-600">{stock.unit}</div>
                          <div className="text-xs text-purple-500 mt-2">
                            Remaining: {Math.max(0, stock.assignedQuantity - (stockUpdateData[stock.skuCode]?.current ?? stock.currentStock) - (stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer))} {stock.unit}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">Liquidation Progress</span>
                        <span className="font-bold">
                          {Math.round((((stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer) + 
                                       (stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor)) / stock.assignedQuantity) * 100)}% Achieved of 50% Target
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (metrics.liquidationRate / 50) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>Target: 50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100">
                        {((stockUpdateData[stock.skuCode]?.current ?? stock.currentStock) + 
                          (stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer) + 
                          (stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor)) === stock.assignedQuantity ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Complete</span>
                          </>
                        ) : ((stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer) + 
                             (stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor)) > 0 ? (
                          <>
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-700">In Progress</span>
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Pending</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700 text-center">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        Balance stock must be either liquidated to farmer or returned to distributor
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleTrackLiquidation}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center font-medium"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Track Liquidation
                </button>
                
                <button
                  onClick={handleUpdateStock}
                  disabled={isUpdatingStock}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center font-medium disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isUpdatingStock ? 'Updating...' : 'Update Stock'}
                </button>

                <button
                  onClick={handleGetSignature}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center font-medium"
                >
                  <Signature className="w-5 h-5 mr-2" />
                  Get Signature
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-medium text-yellow-800 mb-2">Important Notes:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• MDO sees product and SKU wise list assigned by distributor</li>
          <li>• Input current stock at retailer level</li>
          <li>• Record final liquidated stock to farmers</li>
          <li>• Return option available only for remaining balance stock</li>
          <li>• No farmer returns accepted - only retailer to distributor returns</li>
          <li>• Retailer signature required for verification</li>
          <li>• True liquidation for distributor calculated only after complete farmer liquidation</li>
          <li>• <strong>Target "50%"</strong> means: 50% liquidation target achievement</li>
        </ul>
      </div>

      {/* Add Transaction Modal */}
      {showAddTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add Balance Transaction</h3>
              <button
                onClick={() => setShowAddTransactionModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Type</label>
                <select
                  value={newTransaction.recipientType}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, recipientType: e.target.value as 'Retailer' | 'Farmer' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Retailer">Retailer</option>
                  <option value="Farmer">Farmer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name *</label>
                <input
                  type="text"
                  value={newTransaction.recipientName}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter recipient name"
                />
              </div>

              {newTransaction.recipientType === 'Retailer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retailer Code</label>
                  <input
                    type="text"
                    value={newTransaction.recipientCode}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, recipientCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter retailer code"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newTransaction.recipientPhone}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, recipientPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={newTransaction.recipientAddress}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, recipientAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  value={newTransaction.quantity}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter quantity"
                  min="1"
                  max={missingStock}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newTransaction.notes}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={() => setShowAddTransactionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Capture Modal */}
      <SignatureCapture
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSignatureSave}
        title="Retailer Signature Verification"
      />
    </div>
  );
};

export default RetailerLiquidation;