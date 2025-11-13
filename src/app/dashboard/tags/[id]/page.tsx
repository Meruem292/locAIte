
import { tags } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapMock } from "@/components/dashboard/MapMock";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { BluetoothConnector } from "@/components/dashboard/BluetoothConnector";

export default function TagDetailPage({ params }: { params: { id: string } }) {
  const tag = tags.find((t) => t.id === params.id);

  if (!tag) {
    notFound();
  }

  const tagImage = PlaceHolderImages.find((p) => p.id === tag.image);
  const mapImage = PlaceHolderImages.find((p) => p.id === 'map-mock');

  const getBadgeVariant = (status: typeof tag.status) => {
    switch (status) {
      case 'With You':
        return 'default';
      case 'Nearby':
        return 'secondary';
      case 'Far':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  return (
    <div className="p-4 md:p-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all tags
        </Link>
      </Button>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-3xl font-bold font-headline text-primary mb-2">{tag.name}</CardTitle>
                  <Badge variant={getBadgeVariant(tag.status)}>{tag.status}</Badge>
                </div>
                {tagImage && (
                  <Image
                    src={tagImage.imageUrl}
                    alt={tagImage.description}
                    width={80}
                    height={80}
                    className="rounded-lg border-2 p-1"
                    data-ai-hint={tagImage.imageHint}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Last known location</p>
                    <p>{tag.currentLocation.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Battery className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Battery</p>
                    <p>{tag.battery}%</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <BluetoothConnector />
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
              <CardTitle>Location on Map</CardTitle>
            </CardHeader>
            <CardContent>
              {mapImage && (
                <MapMock imageUrl={mapImage.imageUrl} description={mapImage.description} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <AiInsights tag={tag} />
        </div>
      </div>
    </div>
  );
}
