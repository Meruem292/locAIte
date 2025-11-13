'use client';

type MapEmbedProps = {
    latitude: number;
    longitude: number;
};

export function MapEmbed({ latitude, longitude }: MapEmbedProps) {
    // This uses a query parameter 'q' to center the map, which works without an API key for basic embeds.
    // The 'pb' parameter is complex and not necessary for just showing a location.
    const mapSrc = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;

    return (
        <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
            className="rounded-lg"
        ></iframe>
    );
}
