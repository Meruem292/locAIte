import { TagList } from "@/components/dashboard/TagList";
import { tags } from "@/lib/data";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HardDrive } from "lucide-react";


export default function DashboardPage() {
  // Assuming we only need AI insights for the first tag for this layout example
  const firstTag = tags[0];

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
            {firstTag && <AiInsights tag={firstTag} />}
        </div>
    </div>
  );
}
