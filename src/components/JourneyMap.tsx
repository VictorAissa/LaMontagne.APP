import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    LayersControl,
} from 'react-leaflet';
import L from 'leaflet';
import startIcon from '@/assets/icons/topo/from_point.png';
import endIcon from '@/assets/icons/topo/to_point.png';
import * as toGeoJSON from '@tmcw/togeojson';
import { GeoJSON } from 'react-leaflet/GeoJSON';

interface GeoPoint {
    latitude: number;
    longitude: number;
}

interface Props {
    start?: GeoPoint;
    end?: GeoPoint;
    gpxUrl?: string;
    onStartChange?: (point: GeoPoint) => void;
    onEndChange?: (point: GeoPoint) => void;
    isEditable?: boolean;
}

function DraggableMarkers({
    start,
    end,
    onStartChange,
    onEndChange,
    isEditable = false,
}: Props) {
    const handleStartDragEnd = (e: L.DragEndEvent) => {
        const { lat, lng } = e.target.getLatLng();
        if (onStartChange) {
            onStartChange({
                latitude: lat,
                longitude: lng,
            });
        }
    };

    const handleEndDragEnd = (e: L.DragEndEvent) => {
        const { lat, lng } = e.target.getLatLng();
        if (onEndChange) {
            onEndChange({
                latitude: lat,
                longitude: lng,
            });
        }
    };

    const customStartIcon = new L.Icon({
        iconUrl: startIcon,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -34],
    });

    const customEndIcon = new L.Icon({
        iconUrl: endIcon,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -34],
    });

    const toLeafletLatLng = (point?: GeoPoint): [number, number] => {
        if (
            !point?.latitude ||
            !point?.longitude ||
            isNaN(point.latitude) ||
            isNaN(point.longitude)
        ) {
            return [45.900002, 6.11667]; // Default center
        }
        return [point.latitude, point.longitude];
    };

    return (
        <>
            {start && (
                <Marker
                    position={toLeafletLatLng(start)}
                    icon={customStartIcon}
                    draggable={isEditable}
                    eventHandlers={{
                        dragend: handleStartDragEnd,
                    }}
                >
                    <Popup>Départ {isEditable ? '(déplaçable)' : ''}</Popup>
                </Marker>
            )}
            {end && (
                <Marker
                    position={toLeafletLatLng(end)}
                    icon={customEndIcon}
                    draggable={isEditable}
                    eventHandlers={{
                        dragend: handleEndDragEnd,
                    }}
                >
                    <Popup>Arrivée {isEditable ? '(déplaçable)' : ''}</Popup>
                </Marker>
            )}
        </>
    );
}

const JourneyMap = ({
    start,
    end,
    gpxUrl,
    onStartChange,
    onEndChange,
    isEditable = false,
}: Props) => {
    const [geoJsonData, setGeoJsonData] = useState<any>(null);
    const defaultCenter: [number, number] = [45.900002, 6.11667];

    // Convert GeoPoint to Leaflet LatLng for map center
    const toLeafletLatLng = (point?: GeoPoint): [number, number] => {
        if (
            !point?.latitude ||
            !point?.longitude ||
            isNaN(point.latitude) ||
            isNaN(point.longitude)
        ) {
            return defaultCenter;
        }
        return [point.latitude, point.longitude];
    };

    const geoJsonStyle = {
        color: '#000',
        weight: 3,
        opacity: 0.8,
    };

    useEffect(() => {
        if (gpxUrl) {
            fetch(gpxUrl)
                .then((response) => response.text())
                .then((gpxString) => {
                    const parser = new DOMParser();
                    const gpxDoc = parser.parseFromString(
                        gpxString,
                        'text/xml'
                    );
                    const geoJson = toGeoJSON.gpx(gpxDoc);
                    setGeoJsonData(geoJson);
                })
                .catch((error) =>
                    console.error('Erreur chargement GPX:', error)
                );
        }
    }, [gpxUrl]);

    const mapCenter = start ? toLeafletLatLng(start) : defaultCenter;

    return (
        <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
            <LayersControl position="topright">
                {/* OpenTopoMap */}
                <LayersControl.BaseLayer checked name="OpenTopo">
                    <TileLayer
                        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        attribution="Map data: &copy; OpenTopoMap (CC-BY-SA)"
                        maxZoom={17}
                    />
                </LayersControl.BaseLayer>

                {/* IGN Plan*/}
                <LayersControl.BaseLayer name="IGN-Plan">
                    <TileLayer
                        url="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
                        attribution="&copy; IGN France"
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>

                {/* IGN Satellite*/}
                <LayersControl.BaseLayer name="IGN-Sat">
                    <TileLayer
                        url="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
                        attribution="&copy; IGN France"
                        maxZoom={19}
                    />
                </LayersControl.BaseLayer>

                {/* SwissTopo */}
                <LayersControl.BaseLayer name="SwissTopo">
                    <TileLayer
                        url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
                        attribution="&copy; SwissTopo"
                        maxZoom={18}
                    />
                </LayersControl.BaseLayer>

                {/* Base OpenStreetMap */}
                <LayersControl.BaseLayer name="OpenStreet">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            <DraggableMarkers
                start={start}
                end={end}
                onStartChange={onStartChange}
                onEndChange={onEndChange}
                isEditable={isEditable}
            />

            {geoJsonData && <GeoJSON data={geoJsonData} style={geoJsonStyle} />}
        </MapContainer>
    );
};

export default JourneyMap;
