'use client';

import { useFirestore } from "@/firebase";
import { doc, collection, query, where, orderBy, limit } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { useCollection } from "@/firebase/firestore/use-collection";
import type { Device } from "@/lib/devices";
import type { Location } from "@/lib/data";
import { notFound } from "next/navigation";
import { Loader2, HardDrive, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { use, useMemo } from "react";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { LocationHistoryTable } from "@/components/dashboard/devices/LocationHistoryTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapEmbed } from "@/components/dashboard/devices/MapEmbed";

function DeviceDetailClient({ id }: { id: string }) {
    const firestore = useFirestore();
    
    const deviceRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'devices', id);
    }, [firestore, id]);

    const { data: device, loading: deviceLoading } = useDoc<Device>(deviceRef, { idField: 'id' });

    const locationsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(
          collection(firestore, 'locations'),
          where('deviceId', '==', id),
          orderBy('timestamp', 'desc'),
          limit(50) // Limit to 50 for AI analysis
        );
    }, [firestore, id]);

    const { data: locations, loading: locationsLoading } = useCollection<Location>(locationsQuery, { idField: 'id' });

    const latestLocation = locations && locations.length > 0 ? locations[0] : null;

    if (deviceLoading || locationsLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!device && !deviceLoading) {
        notFound();
    }

    return (
        <div className="p-4 md:p-8">
             <Button variant="outline" asChild className="mb-6">
                <Link href="/dashboard/devices">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Devices
                </Link>
            </Button>
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4">
                        <HardDrive className="w-10 h-10 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold font-headline text-primary">{device?.name}</h1>
                            <p className="text-sm text-muted-foreground font-mono">{device?.id}</p>
                        </div>
                    </div>
                     {latestLocation ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <span>Live Location</span>
                                </CardTitle>
                                <CardDescription>The most recent location reported by the device.</CardDescription>
                            </CardHeader>
                            <CardContent className="aspect-video w-full p-0">
                                 <MapEmbed
                                    latitude={latestLocation.latitude}
                                    longitude={latestLocation.longitude}
                                />
                            </CardContent>
                        </Card>
                    ) : (
                         <Card className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border p-12 h-64">
                            <MapPin className="w-12 h-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Live Location Available</h3>
                            <p className="mt-1 text-sm text-muted-foreground">The device has not reported a location yet.</p>
                        </Card>
                    )}
                    <LocationHistoryTable deviceId={id} />
                </div>
                 <div className="lg:col-span-1">
                    {locations && device && (
                        <AiInsights deviceId={device.id} locationHistory={locations} />
                    )}
                </div>
            </div>
        </div>
    );
}


export default function DeviceDetailPage({ params }: { params: { id: string }}) {
    const resolvedParams = use(params);
    return <DeviceDetailClient id={resolvedParams.id} />;
}
