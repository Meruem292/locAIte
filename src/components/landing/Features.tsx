import Image from 'next/image';
import { BrainCircuit, MapPin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const featureList = [
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: 'Real-Time GPS Tracking',
    description: 'Pinpoint the exact location of your items on a live map, anytime, anywhere. Our tags offer long battery life and durable design.',
    image: PlaceHolderImages.find(p => p.id === 'feature-gps'),
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: 'AI-Powered Predictions',
    description: "Our smart AI learns your habits. Misplaced your keys? LocAIte analyzes your location history to predict their most probable location, saving you time and stress.",
    image: PlaceHolderImages.find(p => p.id === 'feature-ai'),
  },
];

export function Features() {
  return (
    <section id="features" className="w-full bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl font-headline">How LocAIte Works</h2>
          <p className="max-w-2xl text-lg text-foreground/70">
            A seamless blend of cutting-edge hardware and intelligent software.
          </p>
        </div>
        <div className="space-y-20">
          {featureList.map((feature, index) => (
            <div key={index} className="grid items-center gap-12 md:grid-cols-2">
              <div className={cn("flex flex-col justify-center space-y-4", index % 2 === 1 && "md:order-2")}>
                <div className="flex items-center gap-4">
                  <div className="w-fit rounded-full bg-primary/10 p-3">{feature.icon}</div>
                   <h3 className="text-2xl font-bold text-primary font-headline">{feature.title}</h3>
                </div>
                <p className="text-foreground/80">{feature.description}</p>
              </div>
              <div className={cn("md:order-1", index % 2 === 1 && "md:order-1")}>
                {feature.image && (
                  <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    width={600}
                    height={400}
                    className="h-auto w-full rounded-xl object-cover shadow-lg"
                    data-ai-hint={feature.image.imageHint}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
