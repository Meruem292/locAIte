'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function DashboardPage() {
  // This page is becoming more of a placeholder as we focus on device/tag specifics.
  // We will leave the emergency contacts here for now.

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
             <Card className="h-full">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold">Emergency Contacts</CardTitle>
                        <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <CardDescription>A quick look at your emergency contacts.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* This is a placeholder for where the tag list or contact list would go */}
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-secondary">
                            <p className="font-semibold">Ismayl</p>
                            <p className="text-sm text-muted-foreground">09365413937</p>
                        </div>
                         <div className="p-4 rounded-lg bg-secondary">
                            <p className="font-semibold">Jayson Luzano</p>
                            <p className="text-sm text-muted-foreground">09069347420</p>
                        </div>
                         <div className="p-4 rounded-lg bg-secondary">
                            <p className="font-semibold">Jhon</p>
                            <p className="text-sm text-muted-foreground">09553471926</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to LocAIte</CardTitle>
                    <CardDescription>Select a device to view its details and AI insights.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This dashboard provides an overview of your tracked items. Navigate to the "Devices" section to get started.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
