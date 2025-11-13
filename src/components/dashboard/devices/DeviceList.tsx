import type { Device } from "@/lib/devices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive, Edit, Trash2 } from "lucide-react";

type DeviceListProps = {
  devices: Device[];
};

export function DeviceList({ devices }: DeviceListProps) {
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
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Device</span>
              </Button>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Device</span>
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
