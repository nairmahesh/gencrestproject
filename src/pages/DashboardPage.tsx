import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../layouts/DashboradLayout';
import type { AppDispatch, RootState } from '../store/store';
import { fetchMdoData } from '../store/mdoSlice';
import StatCard from '../components/ui/StatCard';
import { LoaderCircle } from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { dashboard, status } = useSelector((state: RootState) => state.mdo);

  useEffect(() => {
    // We only fetch MDO data if the user is an MDO
    if (user?.role === 'MDO') {
      dispatch(fetchMdoData());
    }
  }, [dispatch, user]);

  // MDO-specific Dashboard
  if (user?.role === 'MDO') {
    if (status === 'loading' || !dashboard) {
        return <DashboardLayout><div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin h-8 w-8" /></div></DashboardLayout>;
    }

    const monthlyCompletion = dashboard.monthly.planned > 0 ? Math.round((dashboard.monthly.done / dashboard.monthly.planned) * 100) : 0;

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-4">MDO Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Activities YTD" value={dashboard.ytd.done} period={`Planned: ${dashboard.ytd.planned}`} />
                <StatCard title="Monthly Activity" value={dashboard.monthly.done} period={`Planned: ${dashboard.monthly.planned}`} />
                <StatCard title="% Monthly Completion" value={monthlyCompletion} isPercentage />
            </div>
        </DashboardLayout>
    );
  }

  // Generic Dashboard for other roles
  return (
    <DashboardLayout>
      <div className="h-full w-full rounded-lg border-2 border-dashed border-border bg-background p-4">
        <div className="flex h-full items-center justify-center rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome to the Gencrest Platform
            </h2>
            <p className="text-secondary-foreground">
              Select a module from the sidebar to get started.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;