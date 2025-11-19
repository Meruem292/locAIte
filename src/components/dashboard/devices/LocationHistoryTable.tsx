'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, where, addDoc, serverTimestamp, Timestamp, limit, startAfter, endBefore, limitToLast, getDocs, QueryDocumentSnapshot, DocumentData, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemo, useState, useEffect } from 'react';
import type { Location } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, PlusCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MapEmbed } from './MapEmbed';


type LocationHistoryTableProps = {
    deviceId: string;
};

const PAGE_SIZE = 5;

export function LocationHistoryTable({ deviceId }: LocationHistoryTableProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [isLastPage, setIsLastPage] = useState(false);
    const [isFirstPage, setIsFirstPage] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const baseQuery = useMemo(() => {
        if (!firestore || !deviceId) return null;
        return query(
            collection(firestore, 'locations'),
            where('deviceId', '==', deviceId),
            orderBy('timestamp', 'desc')
        );
    }, [firestore, deviceId]);

    const handleSnapshot = (documentSnapshots: any) => {
        const newLocations: Location[] = [];
        documentSnapshots.forEach((doc: any) => {
            newLocations.push({ id: doc.id, ...(doc.data() as Omit<Location, 'id'>) });
        });
        setLocations(newLocations);

        if (documentSnapshots.docs.length > 0) {
            setFirstVisible(documentSnapshots.docs[0]);
            const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            setLastVisible(lastDoc);

            if (page > 1) {
                 setIsFirstPage(false);
            } else {
                setIsFirstPage(true);
            }

            // Check if it's the last page
            if (baseQuery) {
                const nextQuery = query(baseQuery, startAfter(lastDoc), limit(1));
                getDocs(nextQuery).then(nextSnap => {
                     setIsLastPage(nextSnap.empty);
                });
            }
        } else {
            setFirstVisible(null);
            setLastVisible(null);
            if (page > 1) { 
                setIsLastPage(true);
            } else {
                setIsLastPage(true);
                setIsFirstPage(true);
            }
        }
        setIsLoading(false);
    }
    
    useEffect(() => {
        if (!baseQuery) return;

        setIsLoading(true);
        const q = query(baseQuery, limit(PAGE_SIZE));
        const unsubscribe = onSnapshot(q, handleSnapshot, (error) => {
            console.error("Error fetching locations:", error);
            toast({ variant: 'destructive', title: 'Error fetching data' });
            setIsLoading(false);
        });

        setPage(1);

        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseQuery]);


    const fetchPage = async (q: any) => {
        setIsLoading(true);
        try {
            const documentSnapshots = await getDocs(q);
            handleSnapshot(documentSnapshots);
        } catch (error) {
            console.error("Error fetching locations:", error);
            toast({ variant: 'destructive', title: 'Error fetching data' });
            setIsLoading(false);
        }
    }


    const fetchNextPage = () => {
        if (!lastVisible || !baseQuery) return;
        fetchPage(query(baseQuery, startAfter(lastVisible), limit(PAGE_SIZE)));
        setPage(prev => prev + 1);
    };

    const fetchPrevPage = () => {
        if (!firstVisible || !baseQuery) return;
        fetchPage(query(baseQuery, endBefore(firstVisible), limitToLast(PAGE_SIZE)));
        setPage(prev => prev - 1);
    };


    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        if (timestamp instanceof Timestamp) {
            return format(timestamp.toDate(), "PPpp");
        }
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return format(date, "PPpp");
        } catch (e) {
            return 'Invalid Date';
        }
    };


    return (
        <Dialog onOpenChange={(open) => !open && setSelectedLocation(null)}>
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Location History</CardTitle>
                        <CardDescription>
                            Recent location updates from this device.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {!isLoading && locations && locations.length > 0 && (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead className="text-right">Coordinates</TableHead>
                                        <TableHead className="text-center">Map</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.map((loc) => (
                                        <TableRow key={loc.id}>
                                            <TableCell>
                                                {formatTimestamp(loc.timestamp)}
                                            </TableCell>
                                            <TableCell>{loc.address || 'N/A'}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">
                                                <a
                                                    href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline hover:text-primary"
                                                >
                                                    {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedLocation(loc)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {!isLoading && (!locations || locations.length === 0) && (
                        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 h-48">
                            <MapPin className="w-12 h-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Location History Found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">This device has not reported any locations yet.</p>
                        </div>
                    )}
                    {locations.length > 0 && (
                        <div className="flex items-center justify-end space-x-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchPrevPage}
                                disabled={isFirstPage || isLoading}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchNextPage}
                                disabled={isLastPage || isLoading}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Location on Map</DialogTitle>
                    <DialogDescription>
                        {selectedLocation?.address || `Coordinates: ${selectedLocation?.latitude}, ${selectedLocation?.longitude}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="aspect-video w-full">
                    {selectedLocation && (
                        <MapEmbed
                            latitude={selectedLocation.latitude}
                            longitude={selectedLocation.longitude}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
