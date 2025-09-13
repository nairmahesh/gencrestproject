import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Navigation,
  Camera,
  FileText,
  User,
  Phone,
  DollarSign,
  Target,
  Star,
  Filter,
  Search,
  Download,
  Edit,
  Trash2
} from 'lucide-react';
import { SignatureCapture } from '../components/SignatureCapture';
import { MediaUpload } from '../components/MediaUpload';

interface Visit {
  id: string;
  customerName: string;
  customerCode: string;
  date: string;
  time: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  type: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  notes?: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration?: number;
  objectives: string[];
  outcomes: string[];
  orderValue?: number;
  paymentCollected?: number;
  nextFollowUp?: string;
  customerFeedback?: {
    satisfaction: number;
    comments: string;
  };
  competitorInfo?: {
    name: string;
    products: string[];
    pricing: number;
  }[];
  media?: string[];
  signature?: string;
  actionItems?: {
    description: string;
    dueDate: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
}

const FieldVisits: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([
    {
      id: '1',
      customerName: 'Ram Kumar Distributors',
      customerCode: 'DLR001',
      date: '2024-01-20',
      time: '10:00 AM',
      location: 'Green Valley, Sector 12',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      type: 'Product Demo',
      status: 'Scheduled',
      objectives: ['Demonstrate new fertilizer line', 'Discuss bulk pricing', 'Collect feedback'],
      outcomes: [],
      orderValue: 0,
      paymentCollected: 0
    },
    {
      id: '2',
      customerName: 'Suresh Traders',
      customerCode: 'DLR002',
      date: '2024-01-20',
      time: '2:30 PM',
      location: 'Market Area, Sector 8',
      coordinates: { lat: 28.5355, lng: 77.3910 },
      type: 'Stock Review',
      status: 'In Progress',
      checkInTime: '2:25 PM',
      notes: 'Customer interested in bulk order',
      objectives: ['Review inventory levels', 'Discuss liquidation strategy'],
      outcomes: ['Identified slow-moving stock', 'Agreed on 15% discount for bulk purchase'],
      orderValue: 45000,
      paymentCollected: 0
    },
    {
      id: '3',
      customerName: 'Amit Agro Solutions',
      customerCode: 'DLR003',
      date: '2024-01-19',
      time: '11:00 AM',
      location: 'Industrial Area',
      coordinates: { lat: 28.4089, lng: 77.3178 },
      type: 'Payment Collection',
      status: 'Completed',
      checkInTime: '10:55 AM',
      checkOutTime: '11:45 AM',
      duration: 50,
      notes: 'Payment collected successfully',
      objectives: ['Collect outstanding payment', 'Discuss new product launch'],
      outcomes: ['Collected ₹25,000', 'Placed order for new products worth ₹35,000'],
      orderValue: 35000,
      paymentCollected: 25000,
      customerFeedback: {
        satisfaction: 4,
        comments: 'Good service and product quality'
      },
      nextFollowUp: '2024-01-25'
    },
  ]);

  const [selectedVisit, setSelectedVisit] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'text-blue-700 bg-blue-100';
      case 'In Progress':
        return 'text-yellow-700 bg-yellow-100';
      case 'Completed':
        return 'text-green-700 bg-green-100';
      case 'Cancelled':
        return 'text-red-700 bg-red-100';
      case 'No Show':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Navigation className="w-4 h-4" />;
      case 'Cancelled':
      case 'No Show':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = visit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visit.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || visit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const todayVisits = visits.filter(visit => visit.date === '2024-01-20');
  const completedToday = todayVisits.filter(visit => visit.status === 'Completed').length;
  const inProgressToday = todayVisits.filter(visit => visit.status === 'In Progress').length;
  const scheduledToday = todayVisits.filter(visit => visit.status === 'Scheduled').length;

  const handleSignature = (signature: string) => {
    if (selectedVisit) {
      setVisits(prev => prev.map(visit => 
        visit.id === selectedVisit 
          ? { ...visit, signature }
          : visit
      ));
    }
    setShowSignatureModal(false);
  };

  const handleMediaUpload = (visitId: string, files: File[]) => {
    console.log('Media uploaded for visit:', visitId, files);
  };

  const startVisit = (visitId: string) => {
    const currentTime = new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setVisits(prev => prev.map(visit => 
      visit.id === visitId 
        ? { ...visit, status: 'In Progress' as const, checkInTime: currentTime }
        : visit
    ));
  };

  const endVisit = (visitId: string) => {
    const currentTime = new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    setVisits(prev => prev.map(visit => {
      if (visit.id === visitId && visit.checkInTime) {
        const checkIn = new Date(`2024-01-20 ${visit.checkInTime}`);
        const checkOut = new Date(`2024-01-20 ${currentTime}`);
        const duration = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60));
        
        return { 
          ...visit, 
          status: 'Completed' as const, 
          checkOutTime: currentTime,
          duration
        };
      }
      return visit;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Field Visits</h1>
          <p className="text-gray-600 mt-1">Manage your daily visits and customer interactions</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Visit
        </button>
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{scheduledToday}</div>
            <div className="text-sm text-blue-700">Scheduled</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{inProgressToday}</div>
            <div className="text-sm text-yellow-700">In Progress</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedToday}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{todayVisits.length}</div>
            <div className="text-sm text-purple-700">Total</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search visits..."
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
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Visits List */}
      <div className="space-y-4">
        {filteredVisits.map((visit) => (
          <div key={visit.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{visit.customerName}</h3>
                  <p className="text-sm text-gray-600">{visit.customerCode} • {visit.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(visit.status)}`}>
                {getStatusIcon(visit.status)}
                <span className="ml-1">{visit.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(visit.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {visit.time}
                {visit.checkInTime && (
                  <span className="ml-2 text-green-600">
                    (Checked in: {visit.checkInTime})
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {visit.location}
              </div>
            </div>

            {/* Visit Details */}
            {visit.status !== 'Scheduled' && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visit.objectives.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Objectives</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {visit.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="w-3 h-3 mr-2 mt-0.5 text-purple-600" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {visit.outcomes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Outcomes</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {visit.outcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-600" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {(visit.orderValue > 0 || visit.paymentCollected > 0) && (
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm text-gray-600">Order Value: </span>
                      <span className="font-medium text-green-600 ml-1">₹{visit.orderValue?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm text-gray-600">Payment: </span>
                      <span className="font-medium text-blue-600 ml-1">₹{visit.paymentCollected?.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {visit.customerFeedback && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Customer Feedback</h4>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= visit.customerFeedback!.satisfaction
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {visit.customerFeedback.satisfaction}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{visit.customerFeedback.comments}</p>
                  </div>
                )}
              </div>
            )}

            {visit.notes && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{visit.notes}</p>
              </div>
            )}

            {/* Media Upload Section */}
            {visit.status === 'In Progress' && (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-3">Visit Documentation</h4>
                <MediaUpload
                  onUpload={(files) => handleMediaUpload(visit.id, files)}
                  maxFiles={5}
                  acceptedTypes={['image/*', 'video/*']}
                  existingMedia={visit.media || []}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {visit.status === 'Scheduled' && (
                <button
                  onClick={() => startVisit(visit.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Start Visit
                </button>
              )}
              
              {visit.status === 'In Progress' && (
                <>
                  <button
                    onClick={() => endVisit(visit.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    End Visit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVisit(visit.id);
                      setShowSignatureModal(true);
                    }}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Signature
                  </button>
                </>
              )}
              
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              {visit.status === 'Completed' && (
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Report
                </button>
              )}
            </div>

            {/* Visit Duration */}
            {visit.duration && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Visit Duration: {visit.duration} minutes</span>
                  {visit.nextFollowUp && (
                    <span>Next Follow-up: {new Date(visit.nextFollowUp).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredVisits.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No visits found</p>
        </div>
      )}

      {/* Signature Capture Modal */}
      <SignatureCapture
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSignature}
        title="Customer Signature"
      />
    </div>
  );
};

export default FieldVisits;