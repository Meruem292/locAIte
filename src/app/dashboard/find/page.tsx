'use client';

import { BluetoothConnector } from '@/components/dashboard/BluetoothConnector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioTower } from 'lucide-react';

export default function FindMyDevicePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Find Nearby Device</h1>
        <p className="text-muted-foreground">
          Use Web Bluetooth to connect directly to your tracker when it's nearby.
        </p>
      </div>
      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <RadioTower className="h-6 w-6 text-primary" />
                <CardTitle>Live Bluetooth Tracker</CardTitle>
            </div>
          <CardDescription>
            Click the button to scan for your device. Make sure your device is in range and Bluetooth is enabled on your computer or smartphone.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <BluetoothConnector />
        </CardContent>
      </Card>
    </div>
  );
}
