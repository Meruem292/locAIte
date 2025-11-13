'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BluetoothConnector } from '@/components/dashboard/BluetoothConnector';

export default function DashboardPage() {
  // This page is becoming more of a placeholder as we focus on device/tag specifics.
  // We will leave the emergency contacts here for now.

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Live Device Sync</CardTitle>
            <CardDescription>
              Connect to a nearby device to sync live location data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BluetoothConnector />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to LocAIte</CardTitle>
            <CardDescription>
              Select a device to view its details and AI insights, or connect to
              a live tracker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This dashboard provides an overview of your tracked items.
              Navigate to the "Devices" section to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
