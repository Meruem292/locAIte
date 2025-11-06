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
    <section id="features" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">How LocAIte Works</h2>
          <p className="max-w-2xl text-lg text-foreground/70">
            A seamless blend of cutting-edge hardware and intelligent software.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {featureList.map((feature, index) => (
            <Card key={index} className="overflow-hidden border-2 border-transparent hover:border-accent/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-card/50">
              <CardHeader className="p-8">
                 <div className="bg-primary/10 rounded-full p-3 w-fit mb-4">{feature.icon}</div>
                <CardTitle className="text-2xl font-bold font-headline text-primary">{feature.title}</CardTitle>
                <CardDescription className="text-base pt-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {feature.image && (
                  <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    width={600}
                    height={400}
                    className="object-cover w-full h-64"
                    data-ai-hint={feature.image.imageHint}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
