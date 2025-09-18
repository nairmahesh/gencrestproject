/**
 * File: src/pages/RetailerLiquidation.tsx
 * Author: GSDP INTEGRATION
 *
 * Purpose: This component provides a detailed view for an MDO to manage a specific
 * distributor's stock liquidation. It fetches live data, allows for SKU-wise stock
 * updates, and handles the detailed logic of stock movements.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Building,
  MapPin,
  Users,
  Edit,
  Save,
  X,
  Plus,
  Minus,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';

// --- Interfaces for Data Structures ---

interface IStockItem {
  skuCode: string;
  skuName: string;
  openingStock: number;
  currentStock: number;
}

interface IDistributor {
  _id: string;
  code: string;
  name: string;
  territory: string;
  region: string;
  zone: string;
  assignedMdoId: string;
  stock: IStockItem[];
}

interface IRetailer {
    _id: string;
    name: string;
    distributorId: string;
}

interface RetailerAssignment {
    retailerId: string;
    skuCode: string;
    skuName: string;
    assignedQty: number;
}

// --- Component ---

const RetailerLiquidation: React.FC = () => {
  const { id: distributorId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- State Management ---
  const [distributor, setDistributor] = useState<IDistributor | null>(null);
  const [retailers, setRetailers] = useState<IRetailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the Stock Update Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSku, setSelectedSku] = useState<IStockItem | null>(null);
  const [physicalStock, setPhysicalStock] = useState(0);
  const [soldToFarmerQty, setSoldToFarmerQty] = useState(0);
  const [retailerAssignments, setRetailerAssignments] = useState<RetailerAssignment[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    if (!distributorId) {
      setError("No distributor ID provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [distributorData, retailersData] = await Promise.all([
          api.getDistributorDetails(distributorId),
          api.getRetailersByDistributor(distributorId)
        ]);
        setDistributor(distributorData.distributor);
        setRetailers(retailersData.retailers);
        setError(null);
      } catch (err) {
        setError("Failed to load distributor and retailer data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [distributorId]);

  // --- Memoized Calculations for Modal ---
  const stockDifference = useMemo(() => {
    if (!selectedSku) return 0;
    return selectedSku.currentStock - physicalStock;
  }, [selectedSku, physicalStock]);

  const totalAssignedToRetailers = useMemo(() => {
    return retailerAssignments.reduce((sum, r) => sum + r.assignedQty, 0);
  }, [retailerAssignments]);

  const unaccountedStock = useMemo(() => {
      if (stockDifference < 0) return 0; // Not a reduction
      return stockDifference - soldToFarmerQty - totalAssignedToRetailers;
  }, [stockDifference, soldToFarmerQty, totalAssignedToRetailers]);


  // --- Event Handlers ---

  const handleOpenModal = (sku: IStockItem) => {
    setSelectedSku(sku);
    setPhysicalStock(sku.currentStock);
    setSoldToFarmerQty(0);
    setRetailerAssignments([]);
    setSubmissionError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSku(null);
  };

  const handleAddRetailerAssignment = () => {
    if (!selectedSku) return;
    setRetailerAssignments([
        ...retailerAssignments,
        { retailerId: '', skuCode: selectedSku.skuCode, skuName: selectedSku.skuName, assignedQty: 0 }
    ]);
  };

  const handleRetailerAssignmentChange = (index: number, field: keyof RetailerAssignment, value: any) => {
    const newAssignments = [...retailerAssignments];
    const assignment = newAssignments[index];
    (assignment[field] as any) = value;
    
    if (field === 'assignedQty') {
        assignment.assignedQty = parseInt(value, 10) || 0;
    }
    
    setRetailerAssignments(newAssignments);
  };

  const handleRemoveRetailerAssignment = (index: number) => {
    setRetailerAssignments(retailerAssignments.filter((_, i) => i !== index));
  };

  const handleSubmitStockUpdate = async () => {
    if (!distributorId || !selectedSku || unaccountedStock !== 0) {
      setSubmissionError("Cannot save. Please ensure all stock differences are accounted for.");
      return;
    }
    
    setSubmissionError(null);

    const payload = {
      skuCode: selectedSku.skuCode,
      skuName: selectedSku.skuName,
      currentStockAsPerSystem: selectedSku.currentStock,
      physicalStock: physicalStock,
      soldToFarmerQty: soldToFarmerQty,
      assignedToRetailers: retailerAssignments.filter(r => r.retailerId && r.assignedQty > 0),
    };

    try {
        await api.updateDistributorStock(distributorId, payload);
        handleCloseModal();
        // Re-fetch data to show updated stock
        const updatedDistributorData = await api.getDistributorDetails(distributorId);
        setDistributor(updatedDistributorData.distributor);
    } catch (error: any) {
        setSubmissionError(error.message || "An unexpected error occurred.");
    }
  };

  // --- Render Logic ---

  if (loading) return <div className="text-center p-8">Loading Distributor Details...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!distributor) return <div className="text-center p-8">Distributor not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/liquidation')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{distributor.name}</h1>
            <p className="text-gray-600 mt-1">Manage stock and liquidation for {distributor.code}</p>
          </div>
        </div>
      </div>

      {/* Distributor Info Card */}
      <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <div>
                  <p className="font-medium">Territory: {distributor.territory}</p>
                  <p>Region: {distributor.region}</p>
                  </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <div>
                  <p className="font-medium">Retailers: {retailers.length}</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Product Stock List */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Stock Details</h3>
        <div className="space-y-3">
          {distributor.stock.map((sku) => (
            <div key={sku.skuCode} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                    <p className="font-semibold text-gray-800">{sku.skuName}</p>
                    <p className="text-sm text-gray-500">{sku.skuCode}</p>
                </div>
                <div className='flex items-center space-x-6'>
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Opening</p>
                        <p className="font-bold text-lg text-gray-700">{sku.openingStock}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Current</p>
                        <p className="font-bold text-lg text-blue-600">{sku.currentStock}</p>
                    </div>
                    <button 
                        onClick={() => handleOpenModal(sku)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Stock
                    </button>
                </div>
            </div>
          ))}
          {distributor.stock.length === 0 && <p className="text-gray-500">No stock information available for this distributor.</p>}
        </div>
      </div>

      {/* Stock Update Modal */}
      {isModalOpen && selectedSku && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Update Stock for {selectedSku.skuName}</h3>
              <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-gray-100"><X/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Physical Stock Entry */}
              <div>
                  <label className="block text-sm font-medium text-gray-700">Physical Stock Count</label>
                  <input
                      type="number"
                      value={physicalStock}
                      onChange={(e) => setPhysicalStock(parseInt(e.target.value) || 0)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">System stock is {selectedSku.currentStock}. Enter the current physical count.</p>
              </div>

              {/* Difference Display */}
              {stockDifference !== 0 && (
                  <div className={`p-4 rounded-md ${stockDifference > 0 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                      <h4 className="font-semibold">{stockDifference > 0 ? 'Stock Reduction' : 'Stock Increase (Return)'}</h4>
                      <p>Difference of <strong>{Math.abs(stockDifference)}</strong> units to be accounted for.</p>
                      {stockDifference < 0 && <p className="text-sm text-red-600 mt-1">Note: Stock increases are treated as returns and will automatically be added back to the distributor's balance.</p>}
                  </div>
              )}

              {/* Account for Reduction */}
              {stockDifference > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-semibold">Account for {stockDifference} units:</h4>
                      {/* Sold to Farmer */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700">1. Quantity Sold to Farmers (True Liquidation)</label>
                          <input
                              type="number"
                              value={soldToFarmerQty}
                              onChange={(e) => setSoldToFarmerQty(Math.min(parseInt(e.target.value) || 0, stockDifference))}
                              max={stockDifference}
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                      </div>

                      {/* Assigned to Retailers */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700">2. Quantity Assigned to Retailers (Stock Transfer)</label>
                          {retailerAssignments.map((assignment, index) => (
                              <div key={index} className="flex items-center gap-2 mt-2">
                                  <select
                                      value={assignment.retailerId}
                                      onChange={(e) => handleRetailerAssignmentChange(index, 'retailerId', e.target.value)}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                  >
                                      <option value="">Select Retailer</option>
                                      {retailers.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                                  </select>
                                  <input
                                      type="number"
                                      placeholder="Qty"
                                      value={assignment.assignedQty}
                                      onChange={(e) => handleRetailerAssignmentChange(index, 'assignedQty', e.target.value)}
                                      className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                                  />
                                  <button onClick={() => handleRemoveRetailerAssignment(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md"><Minus className="w-4 h-4" /></button>
                              </div>
                          ))}
                          <button onClick={handleAddRetailerAssignment} className="mt-2 text-sm text-purple-600 flex items-center gap-1"><Plus className="w-4 h-4"/>Add Retailer Assignment</button>
                      </div>

                      {/* Unaccounted Stock Alert */}
                      {unaccountedStock !== 0 && (
                          <div className="p-3 bg-red-100 text-red-800 rounded-md flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4"/>
                            <span>Unaccounted Stock: <strong>{unaccountedStock}</strong> units</span>
                          </div>
                      )}
                  </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50">
              {submissionError && <p className="text-sm text-red-600 self-center mr-auto">{submissionError}</p>}
              <button onClick={handleCloseModal} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
              <button
                onClick={handleSubmitStockUpdate}
                disabled={unaccountedStock !== 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2 inline-block"/>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerLiquidation;