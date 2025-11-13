'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bluetooth, Loader2, XCircle, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// From your ESP32 code
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export function BluetoothConnector() {
  const [isLoading, setIsLoading] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleLocationUpdate = useCallback(async (event: any) => {
    const value = event.target.value as DataView;
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(value);

    // Format: "Device: L-001, Lat: x.xxxxxx, Lon: y.yyyyyy"
    const deviceIdMatch = text.match(/Device: ([\w-]+)/);
    const currentDeviceId = deviceIdMatch?.[1] ?? null;
    if (currentDeviceId) {
      setDeviceId(currentDeviceId);
    }

    if (text.includes('Lat:') && text.includes('Lon:')) {
      const latMatch = text.match(/Lat: ([\d.-]+)/);
      const lonMatch = text.match(/Lon: ([\d.-]+)/);
      
      const lat = latMatch ? parseFloat(latMatch[1]) : NaN;
      const lon = lonMatch ? parseFloat(lonMatch[1]) : NaN;
      
      if (!isNaN(lat) && !isNaN(lon)) {
        const newLocation = { lat, lon };
        setLocation(newLocation);

        if (currentDeviceId && firestore) {
          try {
            await addDoc(collection(firestore, 'locations'), {
              deviceId: currentDeviceId,
              latitude: newLocation.lat,
              longitude: newLocation.lon,
              timestamp: serverTimestamp(),
            });
          } catch (error) {
            console.error("Error saving location to Firestore:", error);
          }
        }
      }
    } else {
        const messageMatch = text.match(/, (.*)$/);
        if (messageMatch && messageMatch[1]) {
            setLocation(messageMatch[1]);
        } else {
            setLocation(text);
        }
    }
  }, [firestore]);

  const connectToDevice = useCallback(async (deviceToConnect: BluetoothDevice) => {
    setIsLoading(true);
    setDevice(deviceToConnect);
    toast({
      title: 'Device Found',
      description: `Connecting to: ${deviceToConnect.name || `ID: ${deviceToConnect.id}`}`,
    });

    deviceToConnect.addEventListener('gattserverdisconnected', onDisconnected);

    try {
      const gattServer = await deviceToConnect.gatt?.connect();
      if (!gattServer) {
        throw new Error("Could not connect to GATT server.");
      }
      setServer(gattServer);

      const service = await gattServer.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleLocationUpdate);
      
      // Read initial value
      const initialValue = await characteristic.readValue();
      handleLocationUpdate({ target: { value: initialValue } });

      setIsLoading(false);
      return true;
    } catch (error: any) {
        setIsLoading(false);
        setDevice(null);
        toast({
            variant: 'destructive',
            title: 'Connection Failed',
            description: error.message || `Could not connect to ${deviceToConnect.name || deviceToConnect.id}.`,
        });
        return false;
    }
  }, [toast, handleLocationUpdate]);

  const onDisconnected = useCallback(() => {
    toast({
      title: 'Device Disconnected',
      description: `Disconnected from ${device?.name || `ID: ${device?.id}`}`,
    });
    setDevice(null);
    setServer(null);
    setLocation(null);
    setDeviceId(null);
  }, [device, toast]);

  const handleManualConnect = async () => {
    if (!navigator.bluetooth) {
      toast({
        variant: 'destructive',
        title: 'Web Bluetooth API not available',
        description: 'Your browser does not support the Web Bluetooth API. Please use a compatible browser like Chrome.',
      });
      return;
    }

    try {
      const requestedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
      });
      await connectToDevice(requestedDevice);
    } catch (error: any) {
      if (error.name !== 'NotFoundError') {
         toast({
          variant: 'destructive',
          title: 'Bluetooth Scan Error',
          description: error.message || 'An unknown error occurred during device scan.',
        });
      }
    }
  };
  
  const handleDisconnect = () => {
    server?.disconnect();
  }
  
  useEffect(() => {
    return () => {
      if (device) {
          device.removeEventListener('gattserverdisconnected', onDisconnected);
          server?.disconnect();
      }
    }
  }, [device, server, onDisconnected]);

  return (
    <div className="flex flex-col items-start gap-4">
      {!device ? (
        <Button onClick={handleManualConnect} disabled={isLoading} variant="outline">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bluetooth className="mr-2 h-4 w-4" />
          )}
          Connect to Live Tracker
        </Button>
      ) : (
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-2">
                <Button onClick={handleDisconnect} variant="destructive" size="sm">
                  <XCircle className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
                <p className="text-sm text-muted-foreground">
                    Connected to <strong>{device.name || `ID: ${device.id}`}</strong>
                </p>
            </div>
            {location ? (
                 <div className="p-4 bg-secondary rounded-lg border w-full space-y-3">
                    <h4 className="font-semibold text-foreground mb-2">Live GPS Data</h4>
                    {deviceId && (
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="h-4 w-4 text-primary"/>
                        <span className="font-semibold">Device ID:</span>
                        <span className="font-mono">{deviceId}</span>
                      </div>
                    )}
                    {typeof location === 'object' ? (
                      <div>
                        <p className="font-mono text-sm"><span className="font-semibold">Lat:</span> {location.lat.toFixed(6)}</p>
                        <p className="font-mono text-sm"><span className="font-semibold">Lon:</span> {location.lon.toFixed(6)}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {location}
                      </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Waiting for GPS data...
                </div>
            )}
        </div>
      )}
    </div>
  );
}
