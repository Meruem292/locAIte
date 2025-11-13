'use client';

type MapEmbedProps = {
    latitude: number;
    longitude: number;
};

export function MapEmbed({ latitude, longitude }: MapEmbedProps) {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!googleMapsApiKey) {
        return (
            <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                <p className="text-muted-foreground text-center p-4">
                    Google Maps API key is not configured. Please add it to your .env file.
                </p>
            </div>
        );
    }

    const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${latitude},${longitude}&zoom=15`;

    return (
        <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={mapSrc}
            className="rounded-lg"
        ></iframe>
    );
}
