'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemo } from 'react';
import type { Location } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';
import { format } from 'date-fns';

type LocationHistoryTableProps = {
    deviceId: string;
};

export function LocationHistoryTable({ deviceId }: LocationHistoryTableProps) {
    const firestore = useFirestore();

    const locationsQuery = useMemo(() => {
        if (!firestore || !deviceId) return null;
        return query(
            collection(firestore, 'locations'),
            where('deviceId', '==', deviceId),
            orderBy('timestamp', 'desc')
        );
    }, [firestore, deviceId]);

    const { data: locations, loading } = useCollection<Location>(locationsQuery);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Location History</CardTitle>
                <CardDescription>
                    Recent location updates from this device.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {loading && (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {!loading && locations && locations.length > 0 && (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Latitude</TableHead>
                                <TableHead>Longitude</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.map((loc, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {loc.timestamp ? format(new Date(loc.timestamp), "PPpp") : 'N/A'}
                                    </TableCell>
                                    <TableCell>{loc.latitude.toFixed(6)}</TableCell>
                                    <TableCell>{loc.longitude.toFixed(6)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
