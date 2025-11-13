'use client';

import { useFirestore } from "@/firebase";
import { doc, collection, query, where, orderBy, limit } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import { useCollection } from "@/firebase/firestore/use-collection";
import type { Device } from "@/lib/devices";
import type { Location } from "@/lib/data";
import { notFound } from "next/navigation";
import { Loader2, HardDrive, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo } from "react";
import { AiInsights } from "@/components/dashboard/AiInsights";

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
    return <DeviceDetailClient id={params.id} />;
}
