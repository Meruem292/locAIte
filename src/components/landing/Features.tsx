import Image from 'next/image';
import { BrainCircuit, MapPin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

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
    <section id="features" className="w-full bg-primary/5 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl font-headline">How LocAIte Works</h2>
          <p className="max-w-2xl text-lg text-foreground/70">
            A seamless blend of cutting-edge hardware and intelligent software.
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-2">
          {featureList.map((feature, index) => (
            <Card key={index} className="transform-gpu overflow-hidden border-2 border-transparent bg-card/50 shadow-lg transition-all duration-300 hover:border-accent/50 hover:shadow-2xl hover:-translate-y-2">
              <CardContent className="p-0">
                {feature.image && (
                  <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    width={600}
                    height={400}
                    className="h-64 w-full object-cover"
                    data-ai-hint={feature.image.imageHint}
                  />
                )}
              </CardContent>
              <CardHeader className="p-8">
                 <div className="mb-4 w-fit rounded-full bg-primary/10 p-3">{feature.icon}</div>
                <CardTitle className="text-2xl font-bold text-primary font-headline">{feature.title}</CardTitle>
                <CardDescription className="pt-2 text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
