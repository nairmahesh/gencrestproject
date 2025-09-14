import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MobileApp from '../components/MobileApp';

const MobileAppPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* Back Button */}
      <div className="p-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
      <MobileApp />
    </div>
  );
};

export default MobileAppPage;