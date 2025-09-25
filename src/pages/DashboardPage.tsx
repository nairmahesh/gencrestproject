import React from 'react';
import DashboardLayout from '../layouts/DashboradLayout';

const DashboardPage = () => {
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