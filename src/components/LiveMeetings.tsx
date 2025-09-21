import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, User, Phone, X, AlertTriangle } from 'lucide-react';

interface LiveMeeting {
  id: string;
  participantName: string;
  participantRole: string;
  location: string;
  address: string;
  startTime: string;
  duration: number; // in minutes
  status: 'active' | 'paused' | 'ending';
  type: 'Visit' | 'Demo' | 'Collection' | 'Training' | 'Meeting';
  phone?: string;
  notes?: string;
}

interface LiveMeetingsProps {
  meetings: LiveMeeting[];
  onEndMeeting: (meetingId: string) => void;
  userRole: string;
}

const LiveMeetings: React.FC<LiveMeetingsProps> = ({ meetings, onEndMeeting, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'ending': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Visit': return 'bg-blue-100 text-blue-800';
      case 'Demo': return 'bg-purple-100 text-purple-800';
      case 'Collection': return 'bg-green-100 text-green-800';
      case 'Training': return 'bg-orange-100 text-orange-800';
      case 'Meeting': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  if (meetings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gray-900">Live Meetings</h3>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
            {meetings.length} Active
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {userRole === 'TSM' ? 'Team Activities' : 'Current Activities'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 transition-all duration-200">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(meeting.status)} animate-pulse`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{meeting.participantName}</h4>
                    <p className="text-sm text-gray-600">{meeting.participantRole}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(meeting.type)}`}>
                    {meeting.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEndMeeting(meeting.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    title="End Meeting"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <div>
                    <p className="font-medium">{meeting.location}</p>
                    <p className="text-xs">{meeting.address}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <div>
                    <p className="font-medium">{formatDuration(meeting.duration)}</p>
                    <p className="text-xs">Started {meeting.startTime}</p>
                  </div>
                </div>
              </div>

              {meeting.phone && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{meeting.phone}</span>
                </div>
              )}

              {meeting.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{meeting.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(meeting.status)} animate-pulse`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">{meeting.status}</span>
                </div>
                <div className="flex space-x-2">
                  {meeting.phone && (
                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                      Call
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEndMeeting(meeting.id);
                    }}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors"
                  >
                    End Meeting
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMeetings;