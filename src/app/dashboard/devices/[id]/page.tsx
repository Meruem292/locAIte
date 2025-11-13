'use client';

import { useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useDoc } from "@/firebase/firestore/use-doc";
import type { Device } from "@/lib/devices";
import { notFound } from "next/navigation";
import { Loader2, HardDrive, ArrowLeft } from "lucide-react";
import { LocationHistoryTable } from "@/components/dashboard/devices/LocationHistoryTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo, use } from "react";

export default function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const firestore = useFirestore();
    
    const deviceRef = useMemo(() => {
        if (!firestore) return null;
        return doc(firestore, 'devices', id);
    }, [firestore, id]);

    const { data: device, loading } = useDoc<Device>(deviceRef, { idField: 'id' });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!device && !loading) {
        notFound();
    }

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div>
                <Button variant="outline" asChild className="mb-6">
                    <Link href="/dashboard/devices">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Devices
                    </Link>
                </Button>
                <div className="flex items-center gap-4">
                    <HardDrive className="w-10 h-10 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold font-headline text-primary">{device?.name}</h1>
                        <p className="text-sm text-muted-foreground font-mono">{device?.id}</p>
                    </div>
                </div>
            </div>

            <LocationHistoryTable deviceId={id} />
        </div>
    );
}
