'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuth, useFirestore } from '@/firebase';
import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import type { Device } from '@/lib/devices';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Device name must be at least 2 characters.' }),
  id: z.string().min(1, { message: 'Device ID cannot be empty.' }),
});

type AddEditDeviceDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  device?: Device;
};

export function AddEditDeviceDialog({ isOpen, onOpenChange, device }: AddEditDeviceDialogProps) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!device;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: device?.name || '',
      id: device?.id || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(device ? { name: device.name, id: device.id } : { name: '', id: '' });
    }
  }, [isOpen, device, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to manage devices.',
      });
      return;
    }
    setIsLoading(true);

    try {
      if (isEditing && device) {
        const deviceRef = doc(firestore, 'devices', device.id);
        await updateDoc(deviceRef, { name: values.name });
        toast({
          title: 'Device Updated',
          description: `Device "${values.name}" has been updated.`,
        });
      } else {
        const deviceRef = doc(firestore, 'devices', values.id);
        await setDoc(deviceRef, {
          name: values.name,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        toast({
          title: 'Device Added',
          description: `Device "${values.name}" has been added.`,
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not save the device.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Device' : 'Add New Device'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of your device.' : 'Enter a name and a unique ID for your new device.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Car Keys Tracker" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., L-001" {...field} disabled={isLoading || isEditing} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Device'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
