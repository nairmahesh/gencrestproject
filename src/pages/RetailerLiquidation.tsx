import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, Phone, CheckCircle, Clock, AlertTriangle, FileSignature as Signature, Save, Eye, Building, Target, TrendingUp, Users, ShoppingCart } from 'lucide-react';
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
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(null);
  const [stockUpdateData, setStockUpdateData] = useState<{[key: string]: {current: number, liquidated: number, returned: number}}>({});

  // Sample data for retailer liquidation
  const retailerData: RetailerLiquidationData = {
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
    
    liquidationStatus: 'Assigned',
    hasRetailerSignature: false,
    lastVisitDate: '2024-01-20',
    lastVisitBy: 'MDO001',
    
    totalAssignedValue: 59250,
    totalLiquidatedValue: 0,
    liquidationPercentage: 0
  };

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

  const saveStockUpdates = () => {
    console.log('Stock updates saved:', stockUpdateData);
    setShowSignatureModal(true);
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

      {/* Retailer Information Card */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{retailerData.retailerName}</h2>
              <p className="text-gray-600">Code: {retailerData.retailerCode}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(retailerData.liquidationStatus)}`}>
            {getStatusIcon(retailerData.liquidationStatus)}
            <span className="ml-1">{retailerData.liquidationStatus}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {retailerData.retailerPhone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {retailerData.retailerAddress}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            Last Visit: {retailerData.lastVisitDate}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Assigned by Distributor</h3>
          <p className="text-sm text-blue-700">
            <strong>{retailerData.distributorName}</strong> (Code: {retailerData.distributorCode})
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assigned</p>
              <p className="text-2xl font-bold text-gray-900">
                {retailerData.stockDetails.reduce((sum, item) => sum + item.assignedQuantity, 0)} Units
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-yellow-600">
                {retailerData.stockDetails.reduce((sum, item) => sum + item.currentStock, 0)} Units
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Liquidated</p>
              <p className="text-2xl font-bold text-green-600">
                {retailerData.stockDetails.reduce((sum, item) => sum + item.liquidatedToFarmer, 0)} Units
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
              <p className="text-sm text-gray-600">Balance Stock</p>
              <p className="text-2xl font-bold text-orange-600">
                {retailerData.stockDetails.reduce((sum, item) => sum + (item.assignedQuantity - item.currentStock - item.liquidatedToFarmer), 0)} Units
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Liquidation %</p>
              <p className="text-2xl font-bold text-purple-600">{retailerData.liquidationPercentage}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Details */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product & SKU wise Stock Details</h3>
        
        <div className="space-y-4">
          {retailerData.stockDetails.map((stock) => (
            <div key={stock.skuCode} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">{stock.skuName}</h4>
                  <p className="text-sm text-gray-600">SKU: {stock.skuCode} | Unit: {stock.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Assigned Date</p>
                  <p className="font-medium">{new Date(stock.assignedDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Assigned by Distributor</p>
                  <p className="text-lg font-bold text-blue-800">{stock.assignedQuantity} {stock.unit}</p>
                  <p className="text-xs text-blue-600">₹{stock.totalValue.toLocaleString()}</p>
                </div>

                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-600 font-medium">Current Stock</p>
                  <div>
                    <span className="text-lg font-bold text-yellow-800">
                      {stockUpdateData[stock.skuCode]?.current ?? stock.currentStock} {stock.unit}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">(Non-editable)</p>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Liquidated to Farmer</p>
                  <div>
                    <input
                      type="number"
                      value={stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer}
                      onChange={(e) => handleStockUpdate(stock.skuCode, 'liquidated', parseInt(e.target.value) || 0)}
                      className="w-16 text-center text-lg font-bold text-green-800 bg-transparent border-none focus:outline-none"
                      min="0"
                      max={stock.assignedQuantity - (stockUpdateData[stock.skuCode]?.current ?? stock.currentStock)}
                    />
                    <span className="text-lg font-bold text-green-800"> {stock.unit}</span>
                  </div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 font-medium">Return to Distributor</p>
                  <div>
                    <input
                      type="number"
                      value={stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor}
                      onChange={(e) => handleStockUpdate(stock.skuCode, 'returned', parseInt(e.target.value) || 0)}
                      className="w-16 text-center text-lg font-bold text-purple-800 bg-transparent border-none focus:outline-none"
                      min="0"
                      max={Math.max(0, stock.assignedQuantity - (stockUpdateData[stock.skuCode]?.current ?? stock.currentStock) - (stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer))}
                    />
                    <span className="text-lg font-bold text-purple-800"> {stock.unit}</span>
                  </div>
                  <p className="text-xs text-purple-600">
                    Balance Available: {Math.max(0, stock.assignedQuantity - (stockUpdateData[stock.skuCode]?.current ?? stock.currentStock) - (stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer))} {stock.unit}
                  </p>
                  <p className="text-xs text-purple-500 mt-1">
                    (Only balance stock can be returned)
                  </p>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 font-medium">Status</p>
                  <div className="mt-1">
                    {((stockUpdateData[stock.skuCode]?.current ?? stock.currentStock) + 
                      (stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer) + 
                      (stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor)) === stock.assignedQuantity ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                    ) : ((stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer) + 
                         (stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor)) > 0 ? (
                      <Clock className="w-6 h-6 text-yellow-600 mx-auto" />
                    ) : (
                      <Package className="w-6 h-6 text-blue-600 mx-auto" />
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Liquidation Progress</span>
                  <span>
                    {Math.round((((stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer) + 
                                 (stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor)) / stock.assignedQuantity) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(((stockUpdateData[stock.skuCode]?.liquidated ?? stock.liquidatedToFarmer) + 
                                 (stockUpdateData[stock.skuCode]?.returned ?? stock.returnToDistributor)) / stock.assignedQuantity) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Balance must be either liquidated to farmer or returned to distributor
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveStockUpdates}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Update Stock & Get Signature
          </button>
          
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            View History
          </button>
          
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Process Return
          </button>
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
        </ul>
      </div>

      {/* Signature Capture Modal */}
      <SignatureCapture
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={(signature) => {
          console.log('Retailer signature saved:', signature);
          setShowSignatureModal(false);
          alert('Stock updates saved and verified with retailer signature.');
        }}
        title="Retailer Signature Verification"
      />
    </div>
  );
};

export default RetailerLiquidation;