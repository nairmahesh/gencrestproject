/**
 * File: src/pages/Liquidation.tsx
 * Author: GSDP INTEGRATION
 *
 * Purpose: This component displays the list of distributors for an MDO to manage stock liquidation.
 * It now fetches live data from the backend instead of using a local hook.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Search, 
  Eye, 
  ArrowLeft, 
  Building,
  MapPin,
  Tag,
  X
} from 'lucide-react';
import { api } from '../services/api';

interface Distributor {
  _id: string;
  code: string;
  name: string;
  zone: string;
  region: string;
  territory: string;
  status: 'active' | 'inactive' | 'blocked';
  // Note: Detailed metrics will be fetched on the details page.
}

const Liquidation: React.FC = () => {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        setLoading(true);
        const response = await api.getDistributors();
        setDistributors(response.distributors);
        setError(null);
      } catch (err) {
        setError("Failed to load distributor data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDistributors();
  }, []);

  const filteredDistributors = distributors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-gray-700 bg-gray-100';
      case 'blocked': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading Distributors...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

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
            <p className="text-gray-600 mt-1">Select a distributor to manage their stock.</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by distributor name, code, or territory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Distributors List */}
      <div className="space-y-4">
        {filteredDistributors.map((distributor) => (
          <div key={distributor._id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{distributor.name}</h3>
                  <p className="text-sm text-gray-600">{distributor.code}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(distributor.status)}`}>
                  {distributor.status.charAt(0).toUpperCase() + distributor.status.slice(1)}
                </span>
                <button 
                  onClick={() => navigate(`/retailer-liquidation/${distributor._id}`)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Manage Stock
                </button>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600">
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{distributor.territory}</span>
                </div>
                 <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{distributor.region}, {distributor.zone}</span>
                </div>
            </div>
          </div>
        ))}
         {filteredDistributors.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl card-shadow">
                <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No distributors found for your account or filter criteria.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Liquidation;