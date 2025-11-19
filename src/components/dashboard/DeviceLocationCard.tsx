'use client';

import type { Device } from '@/lib/devices';
import type { Location } from '@/lib/data';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapEmbed } from '@/components/dashboard/devices/MapEmbed';
import { Loader2, MapPin, HardDrive } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

type DeviceLocationCardProps = {
  device: Device;
};

export function DeviceLocationCard({ device }: DeviceLocationCardProps) {
  const firestore = useFirestore();

  const latestLocationQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'locations'),
      where('deviceId', '==', device.id),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
  }, [firestore, device.id]);

  const { data: locations, loading } = useCollection<Location>(latestLocationQuery);
  const latestLocation = locations?.[0];

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return format(date, "PPp");
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
            <HardDrive className="h-6 w-6 text-primary"/>
            <CardTitle className="font-headline group-hover:underline">{device.name}</CardTitle>
        </div>
        <CardDescription className="font-mono text-xs !mt-1">{device.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading && (
          <div className="flex items-center justify-center h-48 bg-muted rounded-md">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && latestLocation && (
          <div className="space-y-4">
             <div className="aspect-[16/10] w-full">
                <MapEmbed latitude={latestLocation.latitude} longitude={latestLocation.longitude} />
            </div>
            <div>
                 <p className="text-sm text-muted-foreground">
                    Last seen at {latestLocation.address}
                 </p>
                 <p className="text-xs text-muted-foreground/80 pt-1">
                    {formatTimestamp(latestLocation.timestamp)}
                 </p>
            </div>
          </div>
        )}
        {!loading && !latestLocation && (
          <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-8 h-48">
            <MapPin className="w-10 h-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No location data available yet.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/dashboard/devices/${device.id}`}>
            View Details & History
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
