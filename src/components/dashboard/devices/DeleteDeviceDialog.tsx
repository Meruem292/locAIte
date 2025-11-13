'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import type { Device } from '@/lib/devices';
import { Loader2 } from 'lucide-react';

type DeleteDeviceDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  device: Device;
};

export function DeleteDeviceDialog({ isOpen, onOpenChange, device }: DeleteDeviceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const deviceRef = doc(firestore, 'devices', device.id);
      await deleteDoc(deviceRef);
      toast({
        title: 'Device Deleted',
        description: `Device "${device.name}" has been successfully deleted.`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: error.message || 'There was a problem deleting the device.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the device
            <strong className="text-foreground"> {device.name} </strong>
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
