import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchDistributorSummary } from '../store/liquidationSlice';
import DashboardLayout from '../layouts/DashboradLayout';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import StockEntryModal from '../components/StockEntryModal';
import LiquidationDetails from '../components/LiquidationDetails';
import ValidationStep from '../components/ValidationStep';
import ClassificationStep from '../components/ClassificationStep';
import { useLocation } from '../hooks/useLocation';
import type { StockDifference } from '../interfaces';
import AlertModal from '../components/ui/AlertModal';
import ActivityTracker from '../components/ActivityTracker';

const ALLOWED_DEVIATION_METERS = 50000; // 5 KM

const DistributorLiquidationPage = () => {
  const { distributorId } = useParams<{ distributorId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDistributor, status: dataStatus, error: dataError } = useSelector((state: RootState) => state.liquidation);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockDifferences, setStockDifferences] = useState<StockDifference[] | null>(null);
  const [liquidationAllocations, setLiquidationAllocations] = useState(null);
  const [currentStep, setCurrentStep] = useState<'summary' | 'details' | 'classification' | 'validation'>('summary');
  
  const { status: locStatus, coordinates, error: locError, getLocation } = useLocation();
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    if (distributorId) {
      dispatch(fetchDistributorSummary(distributorId));
    }
  }, [dispatch, distributorId]);

  const getDistanceInMeters = (coords1: {latitude: number, longitude: number}, coords2: {latitude: number, longitude: number}) => {
    const R = 6371e3; // metres
    const φ1 = coords1.latitude * Math.PI/180;
    const φ2 = coords2.latitude * Math.PI/180;
    const Δφ = (coords2.latitude-coords1.latitude) * Math.PI/180;
    const Δλ = (coords2.longitude-coords1.longitude) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const handleEnterStockClick = () => {
    getLocation();
  };

  useEffect(() => {
    if (locStatus === 'success' && coordinates) {
      if (selectedDistributor?.location) {
        const distance = getDistanceInMeters(coordinates, selectedDistributor.location);
        if (distance > ALLOWED_DEVIATION_METERS) {
          setAlert({ isOpen: true, title: "Location Check Failed", message: `You are approximately ${(distance / 1000).toFixed(2)}km away. Stock entry disabled.` });
        } else {
          setIsModalOpen(true);
        }
      }
    } else if (locStatus === 'error') {
      setAlert({ isOpen: true, title: "Location Error", message: `Could not verify location. Please enable location services. Error: ${locError?.message}` });
    }
  }, [locStatus, coordinates, locError, selectedDistributor]);
  
  const handleStockSubmit = (calculatedDifferences: StockDifference[]) => {
    const differences = calculatedDifferences.filter(d => d.difference > 0);
    if (differences.length === 0) {
        setAlert({ isOpen: true, title: "No Stock Difference", message: "No stock reduction was recorded. The process will be finalized with a signature." });
        setCurrentStep('validation');
    } else {
        setStockDifferences(differences);
        setCurrentStep('details');
    }
    setIsModalOpen(false);
  };
  
  const handleDetailsConfirmed = () => setCurrentStep('classification');
  const handleClassificationConfirmed = (allocations: any) => {
    setLiquidationAllocations(allocations);
    setCurrentStep('validation');
  };

  const handleValidationComplete = (validationData: { mdoSignature: string; coSignerSignature: string | null; letterheads: File[]; }) => {
    console.log({
      message: "Validation Complete! Submitting to backend...",
      ...validationData,
      allocations: liquidationAllocations,
      letterheadNames: validationData.letterheads.map(f => f.name),
    });
    setAlert({ isOpen: true, title: "Success", message: "Liquidation entry has been finalized and submitted." });
    setCurrentStep('summary');
    setStockDifferences(null);
    setLiquidationAllocations(null);
  };
  
  const renderCurrentStep = () => {
    if (!selectedDistributor) return null;
    
    switch(currentStep) {
      case 'classification':
        return stockDifferences && <ClassificationStep differences={stockDifferences} onConfirm={handleClassificationConfirmed} />;
      case 'validation':
        return <ValidationStep onCompleteValidation={handleValidationComplete} />;
      case 'details':
        return stockDifferences && <LiquidationDetails differences={stockDifferences} onConfirm={handleDetailsConfirmed} />;
      case 'summary':
      default:
        const { summary } = selectedDistributor;
        return (
          <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <StatCard title="Opening Stock" period="As of 1st April 2025" vol={summary.openingStock.vol} value={summary.openingStock.value} />
              <StatCard title="YTD Net Sales" period="April - Aug, 2025" vol={summary.ytdNetSales.vol} value={summary.ytdNetSales.value} />
              <StatCard title="Liquidation" period="As of Aug (YTD)" vol={summary.liquidation.vol} value={summary.liquidation.value} />
              <StatCard title="Balance Stock" vol={summary.balanceStock.vol} value={summary.balanceStock.value} />
              <StatCard title="% Liquidation" value={summary.percentLiquidation} isPercentage />
            </div>
            <div className="mt-8 text-center">
                <Button size="lg" onClick={handleEnterStockClick} isLoading={locStatus === 'checking'}>
                    {locStatus === 'checking' ? 'Verifying Location...' : 'Enter Current Stock'}
                </Button>
            </div>
          </div>
        );
    }
  }

  return (
    <DashboardLayout>
      <AlertModal {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} />
      <div className="flex items-center justify-between mb-4">
        <Link to="/liquidation" className="flex items-center text-sm hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Summary
        </Link>
        <div className="text-xs text-right text-secondary-foreground">
            <p>Visit Time: {new Date().toLocaleString()}</p>
            <p>User: {user?.name || 'MDO User'}</p>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4">{selectedDistributor?.name || 'Loading...'}</h1>
      
      {dataStatus === 'loading' && currentStep === 'summary' && <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin h-8 w-8" /></div>}
      {dataStatus === 'failed' && <div className="text-danger">Error: {dataError}</div>}

      {selectedDistributor && (
        <>
          {renderCurrentStep()}
          <ActivityTracker />
        </>
      )}

      {isModalOpen && distributorId && (
        <StockEntryModal 
          distributorId={distributorId} 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleStockSubmit}
        />
      )}
    </DashboardLayout>
  );
};

export default DistributorLiquidationPage;