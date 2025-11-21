'use client';
import { useAuth, useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import type { Device } from '@/lib/devices';
import type { Location } from '@/lib/data';
import { useMemo, useState } from 'react';
import { Loader2, RadioTower, Sparkles, HardDrive, Wifi, Smartphone, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiInsights } from '@/components/dashboard/AiInsights';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export default function FindMyDevicePage() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
          Use AI and other methods to predict and find your device's location.
        </p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>How to Find Your Device</CardTitle>
            <CardDescription>
                Use the methods below to locate your device, whether it's far away or nearby.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-primary" />
                            <span>Phone Hotspot Method (for remote location)</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm max-w-none text-foreground/80">
                        <p>If your device is out of Bluetooth range but might be in an area with Wi-Fi, you can use your phone's hotspot to help it connect and report its location.</p>
                        <ol>
                            <li>Turn on your phone’s hotspot while connected to the internet (Wi-Fi or mobile data).</li>
                            <li>Configure the hotspot with the following details:</li>
                            <ul>
                                <li><strong>SSID (Network Name):</strong> <code>{selectedDeviceId ? selectedDeviceId : '<Your-Device-ID>'}</code></li>
                                <li>
                                  <div className="flex items-center gap-2">
                                     <strong>Password:</strong>
                                      <code className="font-mono">{showPassword ? 'pass_locaite' : '••••••••••••'}</code>
                                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                      </Button>
                                  </div>
                                </li>
                            </ul>
                            <li>If the device is within range of your hotspot, it will automatically connect and send its latest location, which will then appear on the map.</li>
                        </ol>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                         <div className="flex items-center gap-3">
                            <Wifi className="h-5 w-5 text-primary" />
                            <span>Wi-Fi Scanning Method (for nearby location)</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm max-w-none text-foreground/80">
                         <p>When your device can't connect to a known Wi-Fi network, it enters Access Point (AP) mode. You can scan for its signal to confirm if it's nearby.</p>
                         <ol>
                            <li>Open your phone’s Wi-Fi settings and scan for nearby networks.</li>
                            <li>Look for an Access Point whose name is the same as your device ID (e.g., <strong>{selectedDeviceId ? selectedDeviceId : 'L-001'}</strong>).</li>
                            <li>If this network appears in your scan, it means the device is powered on and likely very close to your current location. You can then try to find it manually.</li>
                         </ol>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
       </Card>

      <Card>
          <CardHeader>
              <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle>AI Location Analysis</CardTitle>
              </div>
          <CardDescription>
              Select a device to analyze its location history and predict where it might be. This is useful for backtracking to identify the possible location of the device.
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
  );
}
