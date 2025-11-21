'use client';
import { useAuth, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import type { Device } from '@/lib/devices';
import type { Location } from '@/lib/data';
import { useMemo, useState } from 'react';
import { Loader2, RadioTower, Sparkles, HardDrive } from 'lucide-react';
import { BluetoothConnector } from '@/components/dashboard/BluetoothConnector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiInsights } from '@/components/dashboard/AiInsights';

export default function FindMyDevicePage() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const devicesQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'devices'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: devices, loading: devicesLoading } = useCollection<Device>(devicesQuery, { idField: 'id' });

  const locationsQuery = useMemo(() => {
    if (!firestore || !selectedDeviceId) return null;
    return query(
      collection(firestore, 'locations'),
      where('deviceId', '==', selectedDeviceId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
  }, [firestore, selectedDeviceId]);

  const { data: locations, loading: locationsLoading } = useCollection<Location>(locationsQuery, { idField: 'id' });

  const selectedDevice = devices?.find(d => d.id === selectedDeviceId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Find & Analyze</h1>
        <p className="text-muted-foreground">
          Use AI to predict your device's location or connect directly with Web Bluetooth when it's nearby.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <CardTitle>AI Location Analysis</CardTitle>
                    </div>
                <CardDescription>
                    Select a device to analyze its location history and predict where it might be.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0">
                        <label className="text-sm font-medium">Select a Device:</label>
                        {devicesLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                        <Select onValueChange={setSelectedDeviceId} value={selectedDeviceId || undefined}>
                            <SelectTrigger className="w-full sm:w-[280px]">
                            <SelectValue placeholder="Choose a device..." />
                            </SelectTrigger>
                            <SelectContent>
                            {devices?.map(device => (
                                <SelectItem key={device.id} value={device.id}>
                                    <div className="flex items-center gap-2">
                                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                                        <span>{device.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        )}
                    </div>
                     {locationsLoading && selectedDeviceId && (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-4">Loading location history...</span>
                        </div>
                    )}
                    {!selectedDeviceId && !devicesLoading && (
                         <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 h-60">
                            <h3 className="text-lg font-semibold">No Device Selected</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Please select a device to see AI insights.</p>
                        </div>
                    )}
                    {selectedDeviceId && !locationsLoading && locations && selectedDevice && (
                        <AiInsights deviceId={selectedDevice.id} locationHistory={locations} />
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <RadioTower className="h-6 w-6 text-primary" />
                        <CardTitle>Live Bluetooth Tracker</CardTitle>
                    </div>
                <CardDescription>
                    Scan for your device when it's in Bluetooth range.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <BluetoothConnector />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
