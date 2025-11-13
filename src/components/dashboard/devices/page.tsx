'use client';

import { useState } from 'react';
import { PlusCircle, HardDrive, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeviceList } from '@/components/dashboard/devices/DeviceList';
import { AddEditDeviceDialog } from '@/components/dashboard/devices/AddEditDeviceDialog';
import { useAuth } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { Device } from '@/lib/devices';
import { useMemo } from 'react';

export default function DevicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const firestore = useFirestore();

  const devicesQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'devices'),
      where('userId', '==', user.uid)
    );
  }, [firestore, user]);

  const { data: devices, loading } = useCollection<Device>(devicesQuery, { idField: 'id' });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Device Management</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Device
        </Button>
      </div>

      {loading && (
         <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
        </div>
      )}

      {!loading && devices && devices.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 h-64">
            <HardDrive className="w-16 h-16 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">No Devices Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first tracking device.</p>
             <Button
                onClick={() => setIsDialogOpen(true)}
                className="mt-6"
             >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Device
            </Button>
        </div>
      )}

      {!loading && devices && devices.length > 0 && (
        <DeviceList devices={devices} />
      )}

      <AddEditDeviceDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
