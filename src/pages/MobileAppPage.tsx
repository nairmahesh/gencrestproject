import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MobileApp from '../components/MobileApp';

const MobileAppPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* Back Button */}
      <div className="p-4 flex items-center space-x-3">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mobile App Interface</h1>
          <p className="text-gray-600 text-sm">Full mobile application experience</p>
        </div>
      </div>
      <MobileApp />
    </div>
  );
};

export default MobileAppPage;