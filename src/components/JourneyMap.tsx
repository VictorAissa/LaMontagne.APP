import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-gpx';

interface JourneyMapProps {
    start: { lat: number; long: number };
    end: { lat: number; long: number };
    gpxUrl?: string;
}

// Composant pour gérer la logique GPX et le centrage
const MapController = ({ start, end, gpxUrl }: JourneyMapProps) => {
    const map = useMap();
    const gpxLayerRef = useRef<any>(null);

    useEffect(() => {
        // Centrage de la carte
        const bounds = L.latLngBounds([
            [start.lat, start.long],
            [end.lat, end.long],
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });

        // Chargement GPX
        if (gpxUrl) {
            const fetchGpx = async () => {
                try {
                    const response = await fetch(gpxUrl);
                    const gpxData = await response.text();

                    if (gpxLayerRef.current) {
                        gpxLayerRef.current.remove();
                    }

                    gpxLayerRef.current = new (L as any).GPX(gpxData, {
                        async: true,
                        polyline_options: {
                            color: '#3B82F6',
                            weight: 3,
                            opacity: 0.7,
                        },
                    }).addTo(map);
                } catch (error) {
                    console.error('Erreur chargement GPX:', error);
                }
            };

            fetchGpx();
        }

        return () => {
            if (gpxLayerRef.current) {
                gpxLayerRef.current.remove();
            }
        };
    }, [map, start, end, gpxUrl]);

    return null;
};

// Fix des icônes Leaflet
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const JourneyMap = ({ start, end, gpxUrl }: JourneyMapProps) => {
    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <MapContainer
                center={[start.lat, start.long]}
                zoom={13}
                className="w-full h-full"
            >
                <TileLayer
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenTopoMap"
                />

                <MapController start={start} end={end} gpxUrl={gpxUrl} />

                <Marker position={[start.lat, start.long]}>
                    <Popup>Point de départ</Popup>
                </Marker>

                <Marker position={[end.lat, end.long]}>
                    <Popup>Point d'arrivée</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default JourneyMap;
