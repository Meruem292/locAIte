"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bluetooth, Loader2, XCircle, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      const requestedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
      });

      setIsLoading(false);
      setDevice(requestedDevice);
      toast({
        title: 'Device Selected',
        description: `Connecting to: ${requestedDevice.name || `ID: ${requestedDevice.id}`}`,
      });

      // Add listener for disconnection
      requestedDevice.addEventListener('gattserverdisconnected', onDisconnected);

      const gattServer = await requestedDevice.gatt?.connect();
      if (!gattServer) {
        throw new Error("Could not connect to GATT server.");
      }
      setServer(gattServer);

      const service = await gattServer.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleLocationUpdate);
      
      // Read initial value
      const value = await characteristic.readValue();
      handleLocationUpdate({ target: value } as any);

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

  const onDisconnected = () => {
    toast({
      title: 'Device Disconnected',
      description: `Disconnected from ${device?.name || `ID: ${device?.id}`}`,
    });
    setDevice(null);
    setServer(null);
    setLocation(null);
    setDeviceId(null);
  };
  
  const handleDisconnect = () => {
    server?.disconnect();
    // The onDisconnected event listener will handle the state cleanup.
  }

  const handleLocationUpdate = (event: any) => {
    const value = event.target.value as DataView;
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(value);

    // Format: "Device: L-001, Lat: x.xxxxxx, Lon: y.yyyyyy"
    const deviceIdMatch = text.match(/Device: ([\w-]+)/);
    if (deviceIdMatch && deviceIdMatch[1]) {
      setDeviceId(deviceIdMatch[1]);
    }

    if (text.includes('Lat:') && text.includes('Lon:')) {
      const latMatch = text.match(/Lat: ([\d.-]+)/);
      const lonMatch = text.match(/Lon: ([\d.-]+)/);
      
      const lat = latMatch ? parseFloat(latMatch[1]) : NaN;
      const lon = lonMatch ? parseFloat(lonMatch[1]) : NaN;
      
      if (!isNaN(lat) && !isNaN(lon)) {
        setLocation({ lat, lon });
      }
    } else {
        // Handle other messages like "Waiting for GPS..." or "No GPS signal"
        // We'll extract just the message part
        const messageMatch = text.match(/, (.*)$/);
        if (messageMatch && messageMatch[1]) {
            setLocation(messageMatch[1]);
        } else {
            setLocation(text);
        }
    }
  };
  
  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (device) {
          device.removeEventListener('gattserverdisconnected', onDisconnected);
          server?.disconnect();
      }
    }
  }, [device, server]);

  return (
    <div className="flex flex-col items-start gap-4">
      {!device ? (
        <Button onClick={handleConnect} disabled={isLoading} variant="outline">
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
