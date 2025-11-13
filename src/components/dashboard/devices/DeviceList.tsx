'use client';
import { useState } from "react";
import type { Device } from "@/lib/devices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive, Edit, Trash2, ChevronRight } from "lucide-react";
import { AddEditDeviceDialog } from "./AddEditDeviceDialog";
import { DeleteDeviceDialog } from "./DeleteDeviceDialog";
import Link from "next/link";
import { cn } from "@/lib/utils";


type DeviceListProps = {
  devices: Device[];
};

export function DeviceList({ devices }: DeviceListProps) {
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null);

  return (
    <div className="space-y-4">
      {devices.map((device) => (
        <Card key={device.id} className={cn("bg-card transition-shadow duration-300 hover:shadow-md")}>
          <div className="flex items-center justify-between p-4">
            <Link href={`/dashboard/devices/${device.id}`} className="flex-grow group">
              <div className="flex items-center gap-4">
                <HardDrive className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-lg font-medium group-hover:underline">{device.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">{device.id}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2 pl-4">
               <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); setEditingDevice(device); }}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Device</span>
              </Button>
              <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); setDeletingDevice(device); }}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Device</span>
              </Button>
               <Link href={`/dashboard/devices/${device.id}`} className="hidden sm:block">
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
               </Link>
            </div>
          </div>
        </Card>
      ))}

      {editingDevice && (
        <AddEditDeviceDialog 
          isOpen={!!editingDevice}
          onOpenChange={(isOpen) => !isOpen && setEditingDevice(null)}
          device={editingDevice}
        />
      )}

      {deletingDevice && (
        <DeleteDeviceDialog
          isOpen={!!deletingDevice}
          onOpenChange={(isOpen) => !isOpen && setDeletingDevice(null)}
          device={deletingDevice}
        />
      )}
    </div>
  );
}
