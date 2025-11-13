'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemo, useState } from 'react';
import type { Location } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type LocationHistoryTableProps = {
    deviceId: string;
};

export function LocationHistoryTable({ deviceId }: LocationHistoryTableProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAdding, setIsAdding] = useState(false);

    const locationsQuery = useMemo(() => {
        if (!firestore || !deviceId) return null;
        return query(
            collection(firestore, 'locations'),
            where('deviceId', '==', deviceId),
            orderBy('timestamp', 'desc')
        );
    }, [firestore, deviceId]);

    const { data: locations, loading } = useCollection<Location>(locationsQuery, {
        idField: 'id' 
    });

    const handleAddDummyEntry = async () => {
        if (!firestore) return;

        setIsAdding(true);
        try {
            const lat = 34.0522 + (Math.random() - 0.5) * 0.1; // Randomize around LA
            const lon = -118.2437 + (Math.random() - 0.5) * 0.1;

            await addDoc(collection(firestore, 'locations'), {
                deviceId: deviceId,
                latitude: lat,
                longitude: lon,
                timestamp: serverTimestamp(),
            });
            toast({
                title: 'Dummy Location Added',
                description: `A new location entry has been created for device ${deviceId}.`,
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error Adding Entry',
                description: error.message || 'Could not add the dummy location.',
            });
        } finally {
            setIsAdding(false);
        }
    };


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Location History</CardTitle>
                    <CardDescription>
                        Recent location updates from this device.
                    </CardDescription>
                </div>
                <Button onClick={handleAddDummyEntry} disabled={isAdding} size="sm" variant="outline">
                    {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Add Dummy Entry
                </Button>
            </CardHeader>
            <CardContent>
                 {loading && (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {!loading && locations && locations.length > 0 && (
                     <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Latitude</TableHead>
                                    <TableHead>Longitude</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {locations.map((loc) => (
                                    <TableRow key={loc.id}>
                                        <TableCell>
                                            {loc.timestamp ? format(new Date(loc.timestamp), "PPpp") : 'N/A'}
                                        </TableCell>
                                        <TableCell>{loc.latitude.toFixed(6)}</TableCell>
                                        <TableCell>{loc.longitude.toFixed(6)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                     </div>
                )}
                 {!loading && (!locations || locations.length === 0) && (
                    <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 h-48">
                        <MapPin className="w-12 h-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Location History Found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">This device has not reported any locations yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
