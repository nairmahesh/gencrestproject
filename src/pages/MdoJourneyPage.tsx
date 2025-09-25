import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboradLayout';
import type { AppDispatch, RootState } from '../store/store';
import { fetchMdoData } from '../store/mdoSlice';
import { LoaderCircle } from 'lucide-react';

const MdoJourneyPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { journeyPlan, status } = useSelector((state: RootState) => state.mdo);

  useEffect(() => {
    // Fetch data if it's not already loaded
    if (journeyPlan.length === 0) {
      dispatch(fetchMdoData());
    }
  }, [dispatch, journeyPlan]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">MDO Journey Plan</h1>
      <p className="text-secondary-foreground mb-6">
        [cite_start]This is your work plan, assigned by your TSM/RMM. [cite: 58]
      </p>
      
      {status === 'loading' && <div className="flex justify-center py-12"><LoaderCircle className="animate-spin h-8 w-8" /></div>}

      {status === 'succeeded' && (
        <div className="rounded-lg border bg-background">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3 text-left font-semibold">Date</th>
                <th className="p-3 text-left font-semibold">Activity</th>
                <th className="p-3 text-left font-semibold">Village</th>
                <th className="p-3 text-left font-semibold">Distributor</th>
                <th className="p-3 text-right font-semibold">Target</th>
                <th className="p-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {journeyPlan.map((item, index) => (
                <tr key={index}>
                  <td className="p-3">{item.day}</td>
                  <td className="p-3 font-medium">{item.activity}</td>
                  <td className="p-3">{item.village}</td>
                  <td className="p-3">{item.distributor}</td>
                  <td className="p-3 text-right">{item.target}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Done' ? 'bg-green-500/10 text-green-700' : 'bg-amber-500/10 text-amber-700'}`}>
                        {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MdoJourneyPage;