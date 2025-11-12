"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bluetooth, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BluetoothConnector() {
  const [isLoading, setIsLoading] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!navigator.bluetooth) {
      toast({
        variant: 'destructive',
        title: 'Web Bluetooth API not available',
        description: 'Your browser does not support the Web Bluetooth API. Please use a compatible browser like Chrome.',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Request a Bluetooth device with a specific service
      // This is a generic example. Real devices have specific service UUIDs.
      // For example, a heart rate monitor might use 'heart_rate'
      const requestedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // For demo purposes, accept all devices
        // Or filter by services:
        // filters: [{ services: ['battery_service'] }] 
      });

      setDevice(requestedDevice);
      setIsLoading(false);
      toast({
        title: 'Device Selected',
        description: `You selected: ${requestedDevice.name || `ID: ${requestedDevice.id}`}`,
      });
      
      // Note: Connecting and communicating with the device would require more steps,
      // such as connecting to the GATT server and reading characteristics.
      // This is a simplified example to show the connection flow.

    } catch (error: any) {
      setIsLoading(false);
      if (error.name === 'NotFoundError') {
        toast({
          variant: 'destructive',
          title: 'No Device Selected',
          description: 'You did not select a Bluetooth device.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Bluetooth Connection Error',
          description: error.message || 'An unknown error occurred.',
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
        <Button onClick={handleConnect} disabled={isLoading} variant="outline">
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Bluetooth className="mr-2 h-4 w-4" />
            )}
            {device ? `Connected to ${device.name || 'Unnamed Device'}` : 'Connect with Bluetooth'}
        </Button>
        {device && (
            <p className="text-sm text-muted-foreground">
                Successfully selected device: <strong>{device.name || `ID: ${device.id}`}</strong>. Further implementation is needed to read data.
            </p>
        )}
    </div>
  );
}
