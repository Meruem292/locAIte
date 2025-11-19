'use client';
import { useAuth, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import type { Device } from '@/lib/devices';
import { useMemo } from 'react';
import { DeviceLocationCard } from '@/components/dashboard/DeviceLocationCard';
import { Loader2, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const devicesQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'devices'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: devices, loading } = useCollection<Device>(devicesQuery, { idField: 'id' });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!loading && devices && devices.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 h-64">
            <HardDrive className="w-16 h-16 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">No Devices Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Go to the Devices page to add your first tracker.</p>
             <Button
                asChild
                className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
             >
                <Link href="/dashboard/devices">
                    Go to Devices
                </Link>
            </Button>
        </div>
      );
  }

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Live Dashboard</h1>
        <p className="text-muted-foreground">A real-time overview of your tracked devices.</p>
      </div>
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {devices?.map((device) => (
          <DeviceLocationCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}
