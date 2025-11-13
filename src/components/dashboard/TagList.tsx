import type { Tag } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Battery, ChevronRight, MapPin } from "lucide-react";

type TagListProps = {
  tags: Tag[];
};

export function TagList({ tags }: TagListProps) {
  const getImage = (id: string) => PlaceHolderImages.find(p => p.id === id);

  const getBadgeVariant = (status: Tag['status']) => {
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
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {tags.map((tag) => {
        const tagImage = getImage(tag.image);
        return (
          <Link href={`/dashboard/tags/${tag.id}`} key={tag.id} className="group">
            <Card className="h-full flex flex-col transition-shadow duration-300 hover:shadow-lg border-transparent hover:border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-medium">{tag.name}</CardTitle>
                {tagImage && (
                  <Image
                    src={tagImage.imageUrl}
                    alt={tagImage.description}
                    width={40}
                    height={40}
                    className="rounded-lg border"
                    data-ai-hint={tagImage.imageHint}
                  />
                )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between pt-0">
                <div>
                  <Badge variant={getBadgeVariant(tag.status)}>
                    {tag.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> {tag.currentLocation.address}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Battery className="h-4 w-4"/> {tag.battery}%
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
