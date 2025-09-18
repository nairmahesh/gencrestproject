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
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [selectedDistributorId, setSelectedDistributorId] = useState<string>('');
  
  const { 
    overallMetrics, 
    distributorMetrics, 
    getPerformanceMetrics 
  } = useLiquidationCalculation();

  const performanceMetrics = getPerformanceMetrics();

  // SKU Color mapping
  const getSKUColor = (skuCode: string) => {
    switch (skuCode) {
      case 'DAP-25KG': return 'bg-blue-600 text-white';
      case 'DAP-50KG': return 'bg-green-600 text-white';
      case 'UREA-25KG': return 'bg-purple-600 text-white';
      case 'UREA-50KG': return 'bg-orange-600 text-white';
      case 'NPK-25KG': return 'bg-red-600 text-white';
      case 'NPK-50KG': return 'bg-indigo-600 text-white';
      case 'MOP-25KG': return 'bg-pink-600 text-white';
      case 'MOP-50KG': return 'bg-teal-600 text-white';
      case 'SSP-25KG': return 'bg-yellow-600 text-white';
      case 'SSP-50KG': return 'bg-cyan-600 text-white';
      case 'PEST-500ML': return 'bg-lime-600 text-white';
      case 'PEST-1L': return 'bg-emerald-600 text-white';
      case 'HERB-500ML': return 'bg-violet-600 text-white';
      case 'HERB-1L': return 'bg-fuchsia-600 text-white';
      case 'FUNG-500ML': return 'bg-rose-600 text-white';
      case 'FUNG-1L': return 'bg-amber-600 text-white';
      case 'SEED-1KG': return 'bg-slate-600 text-white';
      case 'SEED-5KG': return 'bg-zinc-600 text-white';
      case 'MICRO-1KG': return 'bg-stone-600 text-white';
      case 'MICRO-5KG': return 'bg-neutral-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
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

  const handleVerifyClick = (distributor: any) => {
    setSelectedDistributor(distributor);
    setShowVerifyModal(true);
  };

  const handleMetricClick = (metric: string, distributorId: string) => {
    setSelectedMetric(metric);
    setSelectedDistributorId(distributorId);
    setShowDetailModal(true);
  };

  const getMetricData = (metric: string, distributorId: string) => {
    const distributor = distributorMetrics.find(d => d.id === distributorId);
    if (!distributor) return { title: '', subtitle: '', data: [] };

    switch (metric) {
      case 'opening':
        return {
          title: `Opening Stock - ${distributor.distributorName}`,
          subtitle: 'SKU-wise opening stock breakdown',
          data: getSKUData(distributorId).map(sku => ({
            ...sku,
            skus: sku.invoices.map(inv => ({
              skuCode: sku.skuCode,
              skuName: sku.skuName,
              unit: sku.unit,
              volume: inv.currentStock * 0.4,
              value: (inv.currentStock * 0.4 * 1350) / 100000,
              unitPrice: 1350
            }))
          }))
        };
      case 'sales':
        return {
          title: `YTD Net Sales - ${distributor.distributorName}`,
          subtitle: 'SKU-wise sales performance',
          data: getSKUData(distributorId).map(sku => ({
            ...sku,
            skus: sku.invoices.map(inv => ({
              skuCode: sku.skuCode,
              skuName: sku.skuName,
              unit: sku.unit,
              volume: inv.currentStock * 1.8,
              value: (inv.currentStock * 1.8 * 1350) / 100000,
              unitPrice: 1350
            }))
          }))
        };
      case 'liquidation':
        return {
          title: `Liquidation - ${distributor.distributorName}`,
          subtitle: 'SKU-wise liquidation breakdown',
          data: getSKUData(distributorId).map(sku => ({
            ...sku,
            skus: sku.invoices.map(inv => ({
              skuCode: sku.skuCode,
              skuName: sku.skuName,
              unit: sku.unit,
              volume: inv.currentStock * 0.5,
              value: (inv.currentStock * 0.5 * 1350) / 100000,
              unitPrice: 1350
            }))
          }))
        };
      default:
        return { title: '', subtitle: '', data: [] };
    }
  };

  const filteredDistributors = distributorMetrics.filter(distributor => {
    const matchesSearch = distributor.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distributor.distributorCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || distributor.status === filterStatus;
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
            <h1 className="text-2xl font-bold">Stock Liquidation</h1>
            <p className="text-purple-100 mt-1">Monitor and track stock liquidation across distributors</p>
          </div>
        </div>
      </div>

      {/* Overall Stats Cards - Matching your image exactly */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Opening Stock */}
        <div className="bg-white rounded-xl border-l-4 border-orange-500 p-6 card-shadow">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Opening Stock</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">32,660</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-orange-600 font-semibold">₹190.00L</div>
        </div>

        {/* YTD Net Sales */}
        <div className="bg-white rounded-xl border-l-4 border-blue-500 p-6 card-shadow">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">YTD Net Sales</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">13,303</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-blue-600 font-semibold">₹43.70L</div>
        </div>

        {/* Liquidation */}
        <div className="bg-white rounded-xl border-l-4 border-green-500 p-6 card-shadow">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Liquidation</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">12,720</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-green-600 font-semibold">₹55.52L</div>
        </div>

        {/* Balance Stock */}
        <div className="bg-white rounded-xl border-l-4 border-purple-500 p-6 card-shadow">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Balance Stock</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">33,243</div>
          <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
          <div className="text-sm text-purple-600 font-semibold">₹178.23L</div>
        </div>
      </div>

      {/* Distributor Entries Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Distributor Entries</h2>
        
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
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
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>Showing {filteredDistributors.length} of {distributorMetrics.length} distributors</span>
            <div className="flex items-center space-x-4">
              <span>Active: {performanceMetrics.activeDistributors}</span>
              <span>High Priority: {performanceMetrics.highPriorityDistributors}</span>
            </div>
          </div>
        </div>

        {/* Distributor Cards */}
        <div className="space-y-6">
          {filteredDistributors.map((distributor) => (
            <div key={distributor.id} className="bg-white rounded-xl p-6 card-shadow">
              {/* Distributor Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{distributor.distributorName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-gray-600">Code: {distributor.distributorCode}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        DAP (Di-Ammonium Phosphate)
                      </span>
                    </div>
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

              {/* Distributor Metrics - 4 cards layout */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Opening Stock */}
                <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-orange-800">Opening Stock</h4>
                    <button 
                      onClick={() => handleMetricClick('opening', distributor.id)}
                      className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600"
                    >
                      View
                    </button>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-orange-600">Volume</p>
                    <p className="text-2xl font-bold text-orange-800">{distributor.metrics.openingStock.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-600">Value</p>
                    <p className="text-lg font-semibold text-orange-700">₹{distributor.metrics.openingStock.value.toFixed(2)}L</p>
                  </div>
                </div>

                {/* YTD Net Sales */}
                <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800">YTD Net Sales</h4>
                    <button 
                      onClick={() => handleMetricClick('sales', distributor.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      View
                    </button>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-blue-600">Volume</p>
                    <p className="text-2xl font-bold text-blue-800">{distributor.metrics.ytdNetSales.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Value</p>
                    <p className="text-lg font-semibold text-blue-700">₹{distributor.metrics.ytdNetSales.value.toFixed(2)}L</p>
                  </div>
                </div>

                {/* Liquidation */}
                <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-800">Liquidation</h4>
                    <button 
                      onClick={() => handleMetricClick('liquidation', distributor.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      View
                    </button>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-green-600">Volume</p>
                    <p className="text-2xl font-bold text-green-800">{distributor.metrics.liquidation.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Value</p>
                    <p className="text-lg font-semibold text-green-700">₹{distributor.metrics.liquidation.value.toFixed(2)}L</p>
                  </div>
                </div>

                {/* Balance Stock */}
                <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-800">Balance Stock</h4>
                    <button 
                      onClick={() => handleVerifyClick(distributor)}
                      className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
                    >
                      Verify
                    </button>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-purple-600">Volume</p>
                    <p className="text-2xl font-bold text-purple-800">{distributor.metrics.balanceStock.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Value</p>
                    <p className="text-lg font-semibold text-purple-700">₹{distributor.metrics.balanceStock.value.toFixed(2)}L</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>% Liquidation</span>
                  <span>{distributor.metrics.liquidationPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, distributor.metrics.liquidationPercentage)}%` }}
                  ></div>
                </div>
              </div>

              {/* Location and Update Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{distributor.region} • {distributor.zone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Updated: 9/18/2025</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Territory: {distributor.territory}</span>
                </div>
              </div>

              {/* Remarks */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">Remarks: Good progress on liquidation</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Verification Modal with SKU Color Tags */}
      {showVerifyModal && selectedDistributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Blue Header */}
            <div className="bg-blue-100 p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedDistributor.distributorName}</h3>
                  <p className="text-gray-600">{selectedDistributor.distributorCode} • {selectedDistributor.territory}</p>
                </div>
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="p-2 hover:bg-blue-200 rounded-full transition-colors"
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
                    {/* SKU Header with Color Tag */}
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getSKUColor(sku.skuCode)}`}>
                        {sku.skuName}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        SKU: {sku.skuCode}
                      </span>
                    </div>
                    
                    {/* Column Headers */}
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div className="text-left">
                        <h5 className="font-semibold text-gray-900">Invoice Details</h5>
                      </div>
                      <div className="text-center">
                        <h5 className="font-semibold text-gray-900">Current Stock (System)</h5>
                      </div>
                      <div className="text-center">
                        <h5 className="font-semibold text-gray-900">Physical Stock (Verified)</h5>
                      </div>
                    </div>
                    
                    {/* Invoice Rows */}
                    <div className="space-y-3">
                      {sku.invoices.map((invoice, index) => (
                        <div key={index} className="grid grid-cols-3 gap-6 items-center py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Invoice: {invoice.invoiceNumber}</p>
                            <p className="text-sm text-gray-600">Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                          </div>
                          <div className="text-center">
                            <input
                              type="number"
                              value={invoice.currentStock}
                              readOnly
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
                            />
                          </div>
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

      {/* Metric Details Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Blue Header */}
            <div className="bg-blue-100 p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{getMetricData(selectedMetric, selectedDistributorId).title}</h3>
                  <p className="text-gray-600">{getMetricData(selectedMetric, selectedDistributorId).subtitle}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">SKU-wise {selectedMetric === 'opening' ? 'Opening Stock' : selectedMetric === 'sales' ? 'Sales' : selectedMetric === 'liquidation' ? 'Liquidation' : 'Stock'} Details</h4>
              
              <div className="space-y-8">
                {getSKUData(selectedDistributorId).map((sku) => (
                  <div key={sku.skuCode}>
                    {/* SKU Header with Color Tag */}
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-4 py-2 rounded-lg text-sm font-medium ${getSKUColor(sku.skuCode)}`}>
                        {sku.skuName}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        SKU: {sku.skuCode}
                      </span>
                    </div>
                    
                    {/* Column Headers */}
                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div className="text-left">
                        <h5 className="font-semibold text-gray-900">Invoice Details</h5>
                      </div>
                      <div className="text-center">
                        <h5 className="font-semibold text-gray-900">Current Stock (System)</h5>
                      </div>
                      <div className="text-center">
                        <h5 className="font-semibold text-gray-900">
                          {selectedMetric === 'opening' ? 'Opening Stock' : 
                           selectedMetric === 'sales' ? 'Sales Volume' : 
                           selectedMetric === 'liquidation' ? 'Liquidated Qty' : 'Stock'}
                        </h5>
                      </div>
                    </div>
                    
                    {/* Invoice Rows */}
                    <div className="space-y-3">
                      {sku.invoices.map((invoice, index) => {
                        // Calculate display value based on metric type
                        let displayValue = invoice.currentStock;
                        if (selectedMetric === 'opening') {
                          displayValue = Math.round(invoice.currentStock * 0.4);
                        } else if (selectedMetric === 'sales') {
                          displayValue = Math.round(invoice.currentStock * 1.8);
                        } else if (selectedMetric === 'liquidation') {
                          displayValue = Math.round(invoice.currentStock * 0.5);
                        }
                        
                        return (
                          <div key={index} className="grid grid-cols-3 gap-6 items-center py-3 border-b border-gray-200">
                            <div>
                              <p className="font-medium text-gray-900">Invoice: {invoice.invoiceNumber}</p>
                              <p className="text-sm text-gray-600">Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-500">Batch: {invoice.batchNumber}</p>
                            </div>
                            <div className="text-center">
                              <input
                                type="number"
                                value={invoice.currentStock}
                                readOnly
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
                              />
                            </div>
                            <div className="text-center">
                              <input
                                type="number"
                                value={displayValue}
                                readOnly
                                className={`w-24 px-3 py-2 border rounded-lg text-center ${
                                  selectedMetric === 'opening' ? 'border-orange-300 bg-orange-50 text-orange-800' :
                                  selectedMetric === 'sales' ? 'border-blue-300 bg-blue-50 text-blue-800' :
                                  selectedMetric === 'liquidation' ? 'border-green-300 bg-green-50 text-green-800' :
                                  'border-gray-300 bg-gray-50'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredDistributors.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No distributors found</p>
        </div>
      )}
    </div>
  );
};

export default Liquidation;