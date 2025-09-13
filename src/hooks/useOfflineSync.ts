import { useState, useEffect } from 'react';

interface OfflineData {
  id: string;
  type: 'liquidation' | 'visit' | 'order' | 'claim';
  data: any;
  timestamp: string;
  synced: boolean;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending sync data from localStorage
    const stored = localStorage.getItem('pendingSync');
    if (stored) {
      setPendingSync(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToSyncQueue = (type: OfflineData['type'], data: any) => {
    const item: OfflineData = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString(),
      synced: false,
    };

    const updated = [...pendingSync, item];
    setPendingSync(updated);
    localStorage.setItem('pendingSync', JSON.stringify(updated));

    if (isOnline) {
      syncData();
    }
  };

  const syncData = async () => {
    if (!isOnline || pendingSync.length === 0) return;

    try {
      // Simulate API sync
      const synced = pendingSync.map(item => ({ ...item, synced: true }));
      setPendingSync([]);
      localStorage.removeItem('pendingSync');
      
      console.log('Data synced successfully:', synced);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      syncData();
    }
  }, [isOnline]);

  return {
    isOnline,
    pendingSync: pendingSync.length,
    addToSyncQueue,
    syncData,
  };
};