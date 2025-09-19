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
  Minus
} from 'lucide-react';
import { useLiquidationCalculation } from '../hooks/useLiquidationCalculation';
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
  const [editingStock, setEditingStock] = useState(false);
  const [tempStock, setTempStock] = useState({ inv1: 105, inv2: 105 });
  const [uploadedProofs, setUploadedProofs] = useState<ProofItem[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const { overallMetrics, distributorMetrics } = useLiquidationCalculation();
  const { latitude, longitude, error: locationError } = useGeolocation();

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
    setEditingStock(false);
    alert(`Liquidation data saved successfully with ${uploadedProofs.length} proofs!`);
  };

  const filteredDistributors = distributorMetrics.filter(distributor =>
    distributor.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.distributorCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Summary Cards */}
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
          <div className="text-sm text-gray-500">Value: ₹{overallMetrics.openingStock.value.toFixed(2)}L</div>
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
          <div className="text-sm text-gray-500">Value: ₹{overallMetrics.ytdNetSales.value.toFixed(2)}L</div>
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
          <div className="text-sm text-gray-500">Value: ₹{overallMetrics.liquidation.value.toFixed(2)}L</div>
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
          <div className="text-sm text-gray-500">Performance</div>
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
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Distributors List */}
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
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{distributor.metrics.liquidationPercentage}%</div>
                <div className="text-sm text-gray-600">Liquidation Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{distributor.metrics.openingStock.volume}</div>
                <div className="text-xs text-orange-600">Opening Stock</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{distributor.metrics.ytdNetSales.volume}</div>
                <div className="text-xs text-blue-600">YTD Sales</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{distributor.metrics.liquidation.volume}</div>
                <div className="text-xs text-green-600">Liquidated</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">{distributor.metrics.balanceStock.volume}</div>
                <div className="text-xs text-gray-600">Balance</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedDistributor(distributor)}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Distributor Detail Modal */}
      {selectedDistributor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-blue-50">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedDistributor.distributorName}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedDistributor.distributorCode} • {selectedDistributor.territory}</p>
              </div>
              <button
                onClick={() => setSelectedDistributor(null)}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Product Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">DAP (Di-Ammonium Phosphate)</h4>
                      <p className="text-gray-600">SKU: DAP-50KG • DAP 50kg Bag</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      DAP 50kg Bag
                    </span>
                  </div>

                  {/* Stock Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Invoice Details</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <p className="font-medium">Invoice: INV-2024-001</p>
                            <p className="text-sm text-gray-600">Date: 1/15/2024</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <p className="font-medium">Invoice: INV-2024-002</p>
                            <p className="text-sm text-gray-600">Date: 1/15/2024</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Stock Verification</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Current Stock (System)</p>
                          <div className="bg-blue-100 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600">105</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Physical Stock (Verified)</p>
                          <div className="bg-green-100 rounded-lg p-4">
                            {editingStock ? (
                              <input
                                type="number"
                                value={tempStock.inv1}
                                onChange={(e) => setTempStock(prev => ({ ...prev, inv1: parseInt(e.target.value) || 0 }))}
                                className="w-full text-center text-2xl font-bold text-green-600 bg-transparent border-b-2 border-green-300 focus:border-green-500 outline-none"
                              />
                            ) : (
                              <div className="text-2xl font-bold text-green-600">105</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        {editingStock ? (
                          <>
                            <button
                              onClick={() => setEditingStock(false)}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingStock(false)}
                              className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingStock(true)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Verify Stock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof Upload Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Upload Proof</h4>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {uploadedProofs.length} proofs uploaded
                    </span>
                  </div>

                  {isCapturing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-4">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-blue-800">Capturing with location and timestamp...</p>
                    </div>
                  )}

                  {/* Primary Actions - Side by Side */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button 
                      onClick={() => handleCameraCapture('photo')}
                      disabled={isCapturing || !latitude || !longitude}
                      className="bg-blue-600 text-white py-4 rounded-lg flex flex-col items-center disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-8 h-8 mb-2" />
                      <span className="text-lg font-medium">Click Pic</span>
                      <span className="text-sm opacity-90">With timestamp & location</span>
                    </button>
                    
                    <label className="bg-purple-600 text-white py-4 rounded-lg flex flex-col items-center cursor-pointer hover:bg-purple-700 transition-colors">
                      <Upload className="w-8 h-8 mb-2" />
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
                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <div className={`p-4 rounded-lg border mb-4 ${
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
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Uploaded Proofs ({uploadedProofs.length})</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
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
                </div>

                {/* Verification Status */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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