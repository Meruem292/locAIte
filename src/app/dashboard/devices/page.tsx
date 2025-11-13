import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { devices } from "@/lib/devices";
import { DeviceList } from "@/components/dashboard/devices/DeviceList";

export default function DevicesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">Device Management</h1>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Device
        </Button>
      </div>
      <DeviceList devices={devices} />
    </div>
  );
}
