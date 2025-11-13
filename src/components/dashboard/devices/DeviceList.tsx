'use client';
import { useState } from "react";
import type { Device } from "@/lib/devices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive, Edit, Trash2 } from "lucide-react";
import { AddEditDeviceDialog } from "./AddEditDeviceDialog";
import { DeleteDeviceDialog } from "./DeleteDeviceDialog";


type DeviceListProps = {
  devices: Device[];
};

export function DeviceList({ devices }: DeviceListProps) {
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null);

  return (
    <div className="space-y-4">
      {devices.map((device) => (
        <Card key={device.id} className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-4">
              <HardDrive className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-lg font-medium">{device.name}</CardTitle>
                <p className="text-sm text-muted-foreground font-mono">{device.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setEditingDevice(device)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Device</span>
              </Button>
              <Button variant="destructive" size="icon" onClick={() => setDeletingDevice(device)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Device</span>
              </Button>
            </div>
          </CardHeader>
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
