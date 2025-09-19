import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Package, 
  Target,
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  X,
  Camera,
  Upload,
  Video,
  Image as ImageIcon,
  FileText,
  Clock,
  Save,
  ChevronDown
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

interface ProofItem {
  id: string;
  type: 'photo' | 'video' | 'signature';
  url: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  metadata: {
    fileSize: number;
    duration?: number;
    resolution?: string;
  };
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [uploadedProofs, setUploadedProofs] = useState<ProofItem[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const { latitude, longitude, error: locationError } = useGeolocation();

  // Sample distributor data matching the exact design
  const distributors = [
    {
      id: 'DIST001',
      name: 'SRI RAMA SEEDS AND PESTICIDES',
      code: '1325',
      territory: 'North Delhi',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'High',
      liquidationPercentage: 71,
      openingStock: { volume: 210, value: 2.84 },
      ytdNetSales: { volume: 84, value: 1.13 },
      liquidation: { volume: 210, value: 2.84 },
      balanceStock: { volume: 420, value: 5.67 },
      product: 'DAP (Di-Ammonium Phosphate)',
      productCode: 'PT001',
      lastUpdated: '9/18/2025',
      remarks: 'Good progress on liquidation'
    },
    {
      id: 'DIST002',
      name: 'Ram Kumar Distributors',
      code: 'DLR001',
      territory: 'Green Valley',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Medium',
      liquidationPercentage: 29,
      openingStock: { volume: 15000, value: 18.75 },
      ytdNetSales: { volume: 6500, value: 8.13 },
      liquidation: { volume: 6200, value: 7.75 },
      balanceStock: { volume: 15300, value: 19.13 },
      product: 'DAP (Di-Ammonium Phosphate)',
      productCode: 'PT001',
      lastUpdated: '9/18/2025',
      remarks: 'Needs improvement'
    },
    {
      id: 'DIST003',
      name: 'Green Agro Solutions',
      code: 'GAS001',
      territory: 'Sector 8',
      region: 'Delhi NCR',
      zone: 'North Zone',
      status: 'Active',
      priority: 'Medium',
      liquidationPercentage: 26,
      openingStock: { volume: 17620, value: 21.70 },
      ytdNetSales: { volume: 6493, value: 6.57 },
      liquidation: { volume: 6380, value: 7.22 },
      balanceStock: { volume: 17733, value: 21.05 },
      product: 'DAP (Di-Ammonium Phosphate)',
      productCode: 'PT001',
      lastUpdated: '9/18/2025',
      remarks: 'Regular follow-up needed'
    }
  ];

  const generateProofItem = (type: 'photo' | 'video' | 'signature', file?: File): ProofItem => {
    const now = new Date();
    return {
      id: `proof_${Date.now()}`,
      type,
      url: file ? URL.createObjectURL(file) : '/placeholder-image.jpg',
      timestamp: now.toISOString(),
      location: {
        latitude: latitude || 28.6139,
        longitude: longitude || 77.2090,
        address: 'Current Location'
      },
      metadata: {
        fileSize: file?.size || 0,
        duration: type === 'video' ? 30 : undefined,
        resolution: '1920x1080'
      }
    };
  };

  const handleCameraCapture = (type: 'photo' | 'video') => {
    setIsCapturing(true);
    
    setTimeout(() => {
      const newProof = generateProofItem(type);
      setUploadedProofs(prev => [...prev, newProof]);
      setIsCapturing(false);
      alert(`${type === 'photo' ? 'Photo' : 'Video'} captured with location and timestamp!`);
    }, 2000);
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const type = file.type.startsWith('video/') ? 'video' : 'photo';
      const newProof = generateProofItem(type, file);
      setUploadedProofs(prev => [...prev, newProof]);
    });
  };

  const handleSignatureCapture = () => {
    const newProof = generateProofItem('signature');
    setUploadedProofs(prev => [...prev, newProof]);
    alert('Signature captured with location and timestamp!');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleSaveAndExit = () => {
    setSelectedDistributor(null);
    setUploadedProofs([]);
    alert(`Liquidation data saved successfully with ${uploadedProofs.length} proofs!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDistributors = distributors.filter(distributor =>
    distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Stock Liquidation</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Cards - Exact Design Match */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Opening Stock</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">32,660</div>
            <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
            <div className="text-sm text-orange-600 font-semibold">₹190.00L</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">YTD Net Sales</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">13,303</div>
            <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
            <div className="text-sm text-blue-600 font-semibold">₹43.70L</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Liquidation</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">12,720</div>
            <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
            <div className="text-sm text-green-600 font-semibold">₹55.52L</div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Balance Stock</h4>
            <div className="text-3xl font-bold text-gray-900 mb-1">33,243</div>
            <div className="text-sm text-gray-600 mb-2">Kg/Litre</div>
            <div className="text-sm text-purple-600 font-semibold">₹178.23L</div>
          </div>
        </div>

        {/* Distributor Entries Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Distributor Entries</h2>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search distributors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>Showing 3 of 3 distributors</span>
              <div className="flex items-center space-x-4">
                <span>Active: 3</span>
                <span>High Priority: 1</span>
              </div>
            </div>
          </div>

          {/* Distributors List - Exact Design Match */}
          <div className="p-6">
            <div className="space-y-4">
              {distributors.map((distributor) => (
                <div key={distributor.id} className="border border-gray-200 rounded-lg p-6">
                  {/* Distributor Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{distributor.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Code: {distributor.code}</span>
                          <span className="text-blue-600">{distributor.product}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(distributor.status)}`}>
                        {distributor.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(distributor.priority)}`}>
                        {distributor.priority}
                      </span>
                      <button
                        onClick={() => setSelectedDistributor(distributor)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Stock
                      </button>
                    </div>
                  </div>

                  {/* Metrics Cards - Exact Design */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-orange-700">Opening Stock</h4>
                        <button className="bg-orange-500 text-white px-2 py-1 rounded text-xs">View</button>
                      </div>
                      <div className="text-sm text-orange-600 mb-1">Volume</div>
                      <div className="text-2xl font-bold text-orange-800">{distributor.openingStock.volume}</div>
                      <div className="text-sm text-orange-600 mt-2">Value</div>
                      <div className="text-sm font-semibold text-orange-700">₹{distributor.openingStock.value}L</div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-blue-700">YTD Net Sales</h4>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs">View</button>
                      </div>
                      <div className="text-sm text-blue-600 mb-1">Volume</div>
                      <div className="text-2xl font-bold text-blue-800">{distributor.ytdNetSales.volume}</div>
                      <div className="text-sm text-blue-600 mt-2">Value</div>
                      <div className="text-sm font-semibold text-blue-700">₹{distributor.ytdNetSales.value}L</div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-green-700">Liquidation</h4>
                        <button className="bg-green-500 text-white px-2 py-1 rounded text-xs">View</button>
                      </div>
                      <div className="text-sm text-green-600 mb-1">Volume</div>
                      <div className="text-2xl font-bold text-green-800">{distributor.liquidation.volume}</div>
                      <div className="text-sm text-green-600 mt-2">Value</div>
                      <div className="text-sm font-semibold text-green-700">₹{distributor.liquidation.value}L</div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-purple-700">Balance Stock</h4>
                        <button 
                          onClick={() => setSelectedDistributor(distributor)}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verify Stock
                        </button>
                      </div>
                      <div className="text-sm text-purple-600 mb-1">Volume</div>
                      <div className="text-2xl font-bold text-purple-800">{distributor.balanceStock.volume}</div>
                      <div className="text-sm text-purple-600 mt-2">Value</div>
                      <div className="text-sm text-purple-600 font-semibold">₹{distributor.balanceStock.value}L</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>% Liquidation</span>
                      <span className="font-semibold">{distributor.liquidationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${distributor.liquidationPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {distributor.region} • {distributor.zone}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Updated: {distributor.lastUpdated}
                      </span>
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Territory: {distributor.territory}
                      </span>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">Remarks:</span> {distributor.remarks}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Distributor Detail Modal - Exact Design Match */}
      {selectedDistributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header - Blue Background */}
            <div className="bg-blue-50 p-6 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedDistributor.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedDistributor.code} • {selectedDistributor.territory}</p>
                </div>
                <button
                  onClick={() => setSelectedDistributor(null)}
                  className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* SKU-wise Stock Verification */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">SKU-wise Stock Verification</h4>
                  
                  {/* DAP 25kg Bag */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        DAP 25kg Bag
                      </span>
                      <span className="text-sm text-gray-600">SKU: DAP-25KG</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 mb-3">
                        <div>Invoice Details</div>
                        <div>Current Stock (System)</div>
                        <div>Physical Stock (Verified)</div>
                        <div>Actions</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 items-center py-3 border-t border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">Invoice: INV-2024-001</p>
                          <p className="text-sm text-gray-600">Date: 1/15/2024</p>
                          <p className="text-xs text-gray-500">Batch: BATCH-001</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-100 rounded-lg p-3">
                            <div className="text-lg font-bold text-blue-800">105</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <input 
                              type="number" 
                              defaultValue="105" 
                              className="w-full text-center text-lg font-bold text-gray-800 bg-transparent border-none outline-none"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                            Update
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 items-center py-3 border-t border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">Invoice: INV-2024-002</p>
                          <p className="text-sm text-gray-600">Date: 1/15/2024</p>
                          <p className="text-xs text-gray-500">Batch: BATCH-002</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-100 rounded-lg p-3">
                            <div className="text-lg font-bold text-blue-800">105</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <input 
                              type="number" 
                              defaultValue="105" 
                              className="w-full text-center text-lg font-bold text-gray-800 bg-transparent border-none outline-none"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DAP 50kg Bag */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        DAP 50kg Bag
                      </span>
                      <span className="text-sm text-gray-600">SKU: DAP-50KG</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 mb-3">
                        <div>Invoice Details</div>
                        <div>Current Stock (System)</div>
                        <div>Physical Stock (Verified)</div>
                        <div>Actions</div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 items-center py-3 border-t border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">Invoice: INV-2024-001</p>
                          <p className="text-sm text-gray-600">Date: 1/15/2024</p>
                          <p className="text-xs text-gray-500">Batch: BATCH-001</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-100 rounded-lg p-3">
                            <div className="text-lg font-bold text-blue-800">105</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <input 
                              type="number" 
                              defaultValue="105" 
                              className="w-full text-center text-lg font-bold text-gray-800 bg-transparent border-none outline-none"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof Upload Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">Upload Proof</h4>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {uploadedProofs.length} proofs uploaded
                    </span>
                  </div>

                  {isCapturing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-6">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-blue-800">Capturing with location and timestamp...</p>
                    </div>
                  )}

                  {/* Primary Actions - Side by Side */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                      onClick={() => handleCameraCapture('photo')}
                      disabled={isCapturing || !latitude || !longitude}
                      className="bg-blue-600 text-white py-6 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-8 h-8 mb-3" />
                      <span className="text-lg font-medium">Click Pic</span>
                      <span className="text-sm opacity-90">With timestamp & location</span>
                    </button>
                    
                    <label className="bg-purple-600 text-white py-6 rounded-lg flex flex-col items-center cursor-pointer hover:bg-purple-700 transition-colors">
                      <Upload className="w-8 h-8 mb-3" />
                      <span className="text-lg font-medium">Upload Doc</span>
                      <span className="text-sm opacity-90">From device gallery</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                      onClick={() => handleCameraCapture('video')}
                      disabled={isCapturing || !latitude || !longitude}
                      className="bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                    >
                      <Video className="w-5 h-5 mr-2" />
                      <span className="font-medium">Record Video</span>
                    </button>
                    
                    <button
                      onClick={handleSignatureCapture}
                      disabled={!latitude || !longitude}
                      className="bg-green-600 text-white py-3 rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-green-700 transition-colors"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      <span className="font-medium">E-Signature</span>
                    </button>
                  </div>

                  {/* Location & Time Status */}
                  <div className={`p-4 rounded-lg border mb-6 ${
                    latitude && longitude 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className={`w-4 h-4 ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-sm font-medium ${latitude && longitude ? 'text-green-800' : 'text-red-800'}`}>
                          {latitude && longitude 
                            ? `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                            : 'Location access required for proof capture'
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-4 h-4 ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-sm ${latitude && longitude ? 'text-green-700' : 'text-red-700'}`}>
                          {new Date().toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    {locationError && (
                      <p className="text-xs text-red-600 mt-2">{locationError}</p>
                    )}
                  </div>

                  {/* Uploaded Proofs Gallery */}
                  {uploadedProofs.length > 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <h5 className="font-semibold text-gray-900 mb-4">Uploaded Proofs ({uploadedProofs.length})</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {uploadedProofs.map((proof) => (
                          <div key={proof.id} className="relative">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                              {proof.type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center bg-purple-100">
                                  <Video className="w-8 h-8 text-purple-600" />
                                </div>
                              ) : proof.type === 'signature' ? (
                                <div className="w-full h-full flex items-center justify-center bg-green-100">
                                  <FileText className="w-8 h-8 text-green-600" />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100">
                                  <ImageIcon className="w-8 h-8 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-xs text-center mt-1 capitalize font-medium">{proof.type}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Latest Proof Details */}
                      {uploadedProofs.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h6 className="font-semibold text-blue-800 mb-2">Latest Proof Details</h6>
                          {uploadedProofs.slice(-1).map((proof) => {
                            const { date, time } = formatTimestamp(proof.timestamp);
                            return (
                              <div key={proof.id} className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span>Type:</span>
                                    <span className="font-medium capitalize">{proof.type}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="font-medium">{date}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Time:</span>
                                    <span className="font-medium">{time}</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span>Latitude:</span>
                                    <span className="font-medium">{proof.location.latitude.toFixed(6)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Longitude:</span>
                                    <span className="font-medium">{proof.location.longitude.toFixed(6)}</span>
                                  </div>
                                  {proof.metadata.fileSize > 0 && (
                                    <div className="flex justify-between">
                                      <span>Size:</span>
                                      <span className="font-medium">{(proof.metadata.fileSize / 1024).toFixed(1)} KB</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No proofs uploaded yet</p>
                      <p className="text-sm text-gray-400">Click "Click Pic" or "Upload Doc" to add proof with timestamp and location</p>
                    </div>
                  )}

                  {/* Verification Status */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        uploadedProofs.some(p => p.type === 'photo') ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Camera className={`w-4 h-4 ${
                          uploadedProofs.some(p => p.type === 'photo') ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <p className="text-sm font-medium">Photos</p>
                      <p className={`text-xs ${
                        uploadedProofs.some(p => p.type === 'photo') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {uploadedProofs.filter(p => p.type === 'photo').length > 0 ? 'Uploaded' : 'Pending'}
                      </p>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        uploadedProofs.some(p => p.type === 'signature') ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <FileText className={`w-4 h-4 ${
                          uploadedProofs.some(p => p.type === 'signature') ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <p className="text-sm font-medium">Signature</p>
                      <p className={`text-xs ${
                        uploadedProofs.some(p => p.type === 'signature') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {uploadedProofs.some(p => p.type === 'signature') ? 'Captured' : 'Pending'}
                      </p>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        latitude && longitude ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <MapPin className={`w-4 h-4 ${
                          latitude && longitude ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <p className="text-sm font-medium">Location</p>
                      <p className={`text-xs ${
                        latitude && longitude ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {latitude && longitude ? 'Verified' : 'Pending'}
                      </p>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium">Timestamp</p>
                      <p className="text-xs text-blue-600">Auto-captured</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Save & Exit Button */}
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                {uploadedProofs.length > 0 && (
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    {uploadedProofs.length} proof{uploadedProofs.length !== 1 ? 's' : ''} ready to save
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedDistributor(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndExit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save & Exit ({uploadedProofs.length} proofs)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidation;