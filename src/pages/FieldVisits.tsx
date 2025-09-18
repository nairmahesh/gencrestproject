/**
 * File: src/pages/FieldVisits.tsx
 * Author: GSDP INTEGRATION
 *
 * Purpose: This component serves as the detailed activity logging form for MDOs.
 * It fetches a specific activity's details and allows the user to update its status,
 * add notes, and upload proofs of execution like media and signatures.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle,
  Camera,
  FileText,
  Save,
  User,
  AlertTriangle
} from 'lucide-react';
import { SignatureCapture } from '../components/SignatureCapture';
import { MediaUpload } from '../components/MediaUpload';
import { useGeolocation } from '../hooks/useGeolocation';
import { api } from '../services/api';

// --- Interfaces ---

interface IActivity {
    _id: string;
    date: string;
    type: string;
    status: 'planned' | 'done' | 'cancelled';
    notes?: string;
    outcome?: string;
    isSoloVisit: boolean;
    accompaniedBy?: string;
    proofs: string[];
    signature?: string;
    plannedLocation?: { lat: number, lng: number };
    // Mongoose fields for relations
    mdoId: any; 
    planActivityId?: string;
}

// --- Component ---

const FieldVisits: React.FC = () => {
  const { id: activityId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activity, setActivity] = useState<IActivity | null>(null);
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');
  const [isSoloVisit, setIsSoloVisit] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const { latitude, longitude, error: geoError } = useGeolocation();

  useEffect(() => {
    if (!activityId) {
      setError("No activity ID provided.");
      setLoading(false);
      return;
    }

    const fetchActivity = async () => {
      try {
        setLoading(true);
        // NOTE: This assumes an API endpoint exists to fetch a single activity.
        // We will need to add `getMdoActivityById` to api.ts and its backend counterpart.
        // For now, we will simulate this fetch.
        // const fetchedActivity = await api.getMdoActivityById(activityId);
        const fetchedActivity: IActivity = { // Simulated Data
            _id: activityId,
            date: '2025-09-18T10:00:00.000Z',
            type: 'Farmer Meeting',
            status: 'planned',
            notes: 'Initial plan notes.',
            outcome: '',
            isSoloVisit: true,
            proofs: [],
            mdoId: 'mdo1_id'
        };
        setActivity(fetchedActivity);
        setNotes(fetchedActivity.notes || '');
        setOutcome(fetchedActivity.outcome || '');
        setIsSoloVisit(fetchedActivity.isSoloVisit);
      } catch (err) {
        setError("Failed to load activity details.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  const handleSave = async (newStatus: 'done' | 'cancelled') => {
    if (!activityId) return;

    const payload = {
        status: newStatus,
        notes,
        outcome,
        isSoloVisit,
        actualLocation: { lat: latitude, lng: longitude },
        // proofs and signature would be handled by their respective components,
        // which would call the API to upload files and then we'd save the URLs here.
    };

    try {
        await api.updateMdoActivity(activityId, payload);
        navigate('/planning'); // Navigate back to the plan list on success
    } catch (err) {
        setError("Failed to save activity progress.");
    }
  };
  
  if (loading) return <div className="text-center p-8">Loading Activity...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!activity) return <div className="text-center p-8">Activity not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => navigate('/planning')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Activity</h1>
          <p className="text-gray-600 mt-1">{activity.type}</p>
        </div>
      </div>
      
      {/* Activity Details */}
      <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-purple-600"/>{new Date(activity.date).toLocaleDateString()}</div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-purple-600"/>Location Placeholder</div>
          </div>
      </div>

      {/* Logging Form */}
      <div className="bg-white rounded-xl p-6 card-shadow space-y-6">
          {/* Visit Type */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visit Type</label>
              <div className="flex gap-4">
                  <button onClick={() => setIsSoloVisit(true)} className={`flex-1 p-3 rounded-lg border-2 ${isSoloVisit ? 'border-purple-600 bg-purple-50' : 'hover:border-purple-300'}`}>Solo Visit</button>
                  <button onClick={() => setIsSoloVisit(false)} className={`flex-1 p-3 rounded-lg border-2 ${!isSoloVisit ? 'border-purple-600 bg-purple-50' : 'hover:border-purple-300'}`}>Accompanied</button>
              </div>
          </div>

          {/* Outcome */}
          <div>
              <label htmlFor="outcome" className="block text-sm font-medium text-gray-700">Activity Outcome</label>
              <input 
                  type="text"
                  id="outcome"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 10 new leads generated"
              />
          </div>

          {/* Notes */}
          <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea 
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Add any additional details here..."
              />
          </div>

          {/* Proof of Execution */}
          <div className="grid grid-cols-2 gap-6">
              <div>
                  <h4 className="font-medium mb-3">Upload Proof</h4>
                  <MediaUpload onUpload={() => {}} />
                  {geoError && <p className="text-xs text-red-500 mt-2">Could not get location: {geoError}</p>}
                  {latitude && longitude && <p className="text-xs text-green-600 mt-2">Location captured!</p>}
              </div>
              <div>
                  <h4 className="font-medium mb-3">Capture Signature</h4>
                  <button 
                    onClick={() => setShowSignatureModal(true)}
                    className="w-full p-4 border-2 border-dashed rounded-lg text-gray-500 hover:border-purple-500 hover:text-purple-500"
                  >
                    Tap to Sign
                  </button>
              </div>
          </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button 
            onClick={() => handleSave('cancelled')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
            Cancel Activity
        </button>
        <button
            onClick={() => handleSave('done')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
            <CheckCircle className="w-4 h-4" />
            Mark as Done
        </button>
      </div>

      {/* Signature Modal */}
      <SignatureCapture 
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={(signature) => { 
            console.log("Signature captured"); 
            setActivity(prev => prev ? {...prev, signature} : null);
        }}
      />
    </div>
  );
};

export default FieldVisits;