import Image from "next/image";
import { MapPin } from "lucide-react";

type MapMockProps = {
    imageUrl: string;
    description: string;
}

export function MapMock({ imageUrl, description }: MapMockProps) {
  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border shadow-inner">
      <Image
        src={imageUrl}
        alt={description}
        fill
        className="object-cover"
        data-ai-hint="city map"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
        <div className="relative transform-gpu transition-transform hover:scale-110">
          <MapPin className="h-12 w-12 text-destructive drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" fill="currentColor" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+2px)] h-2.5 w-2.5 rounded-full bg-white/90 ring-1 ring-destructive"></span>
        </div>
      </div>
       <div className="absolute bottom-2 left-2 bg-background/80 p-2 rounded-md text-xs text-muted-foreground">
        Map view is a static placeholder.
      </div>
    </div>
  );
}
