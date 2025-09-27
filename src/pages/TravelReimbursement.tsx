import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessValidation } from '../utils/businessValidation';
import { Car, Plus, Calendar, MapPin, DollarSign, Clock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

interface TravelClaim {
  id: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  distance: number;
  mode: 'Car' | 'Bike' | 'Public Transport' | 'Flight' | 'Train';
  amount: number;
  purpose: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Paid';
  receipts: string[];
  approvedBy?: string;
  remarks?: string;
}

const TravelReimbursement: React.FC = () => {
  const navigate = useNavigate();
  const { validateAndAlert } = useBusinessValidation();
  const [claims] = useState<TravelClaim[]>([
    {
      id: '1',
      date: '2024-01-20',
      fromLocation: 'Delhi Office',
      toLocation: 'Green Valley, Sector 12',
      distance: 45,
      mode: 'Car',
      amount: 540,
      purpose: 'Client Visit - Ram Kumar',
      status: 'Approved',
      receipts: ['receipt1.jpg'],
      approvedBy: 'RMM001',
      remarks: 'Approved for client visit'
    },
    {
      id: '2',
      date: '2024-01-19',
      fromLocation: 'Delhi Office',
      toLocation: 'Market Area, Sector 8',
      distance: 32,
      mode: 'Bike',
      amount: 160,
      purpose: 'Stock Review - Suresh Traders',
      status: 'Submitted',
      receipts: ['receipt2.jpg']
    },
    {
      id: '3',
      date: '2024-01-18',
      fromLocation: 'Green Valley',
      toLocation: 'Industrial Area',
      distance: 28,
      mode: 'Car',
      amount: 336,
      purpose: 'Product Demo - Amit Agro',
      status: 'Draft',
      receipts: []
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'text-gray-700 bg-gray-100';
      case 'Submitted':
        return 'text-blue-700 bg-blue-100';
      case 'Approved':
        return 'text-green-700 bg-green-100';
      case 'Rejected':
        return 'text-red-700 bg-red-100';
      case 'Paid':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Submitted':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Car':
      case 'Bike':
        return <Car className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const totalAmount = claims.reduce((sum, claim) => sum + claim.amount, 0);
  const approvedAmount = claims.filter(c => c.status === 'Approved').reduce((sum, claim) => sum + claim.amount, 0);
  const pendingAmount = claims.filter(c => c.status === 'Submitted').reduce((sum, claim) => sum + claim.amount, 0);

  const handleCreateClaim = () => {
    // Example validation for new travel claim
    const sampleClaimData = {
      distance: 45,
      mode: 'Car' as const,
      amount: 540,
      workingHours: 9
    };
    
    const isValid = validateAndAlert('travel_expense', sampleClaimData);
    
    if (isValid) {
      alert('Travel claim validation passed. Proceeding to create claim...');
      // Navigate to claim creation form
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
            <h1 className="text-2xl font-bold text-gray-900">Travel Reimbursement</h1>
            <p className="text-gray-600 mt-1">Track and manage your travel expenses</p>
          </div>
        </div>
        <button 
          onClick={handleCreateClaim}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Claim
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">₹{approvedAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">₹{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim) => (
          <div key={claim.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  {getModeIcon(claim.mode)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{claim.purpose}</h3>
                  <p className="text-sm text-gray-600">{new Date(claim.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(claim.status)}`}>
                {getStatusIcon(claim.status)}
                <span className="ml-1">{claim.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <div>
                  <p className="font-medium">From: {claim.fromLocation}</p>
                  <p>To: {claim.toLocation}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Car className="w-4 h-4 mr-2" />
                <div>
                  <p className="font-medium">{claim.mode}</p>
                  <p>{claim.distance} km</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                <div>
                  <p className="font-medium">₹{claim.amount.toLocaleString()}</p>
                  <p>₹{(claim.amount / claim.distance).toFixed(2)}/km</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <div>
                  <p className="font-medium">Receipts</p>
                  <p>{claim.receipts.length} attached</p>
                </div>
              </div>
            </div>

            {claim.remarks && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{claim.remarks}</p>
                {claim.approvedBy && (
                  <p className="text-xs text-gray-500 mt-1">Approved by: {claim.approvedBy}</p>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors">
                View Details
              </button>
              {claim.status === 'Draft' && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Submit
                </button>
              )}
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelReimbursement;