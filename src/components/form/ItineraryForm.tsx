import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/SectionTitle';
import JourneyMap from '@/components/JourneyMap';
import { Itinerary } from '@/types/Topo';
import { Label } from '@radix-ui/react-label';

interface ItineraryFormProps {
    itinerary: Itinerary;
    onChange: (itinerary: Itinerary) => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
    itinerary,
    onChange,
}) => {
    const handleStartLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const latitude = Number(e.target.value) || 0;
        const updatedItinerary = new Itinerary({
            ...itinerary,
            start: {
                ...itinerary.start,
                latitude,
            },
        });
        onChange(updatedItinerary);
    };

    const handleStartLongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const longitude = Number(e.target.value) || 0;
        const updatedItinerary = new Itinerary({
            ...itinerary,
            start: {
                ...itinerary.start,
                longitude,
            },
        });
        onChange(updatedItinerary);
    };

    const handleEndLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const latitude = Number(e.target.value) || 0;
        const updatedItinerary = new Itinerary({
            ...itinerary,
            end: {
                ...itinerary.end,
                latitude,
            },
        });
        onChange(updatedItinerary);
    };

    const handleEndLongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const longitude = Number(e.target.value) || 0;
        const updatedItinerary = new Itinerary({
            ...itinerary,
            end: {
                ...itinerary.end,
                longitude,
            },
        });
        onChange(updatedItinerary);
    };

    const handleGpxFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Pour un vrai upload de fichier GPX, il faudrait l'envoyer au serveur
            // et récupérer l'URL. Ici, on simule juste un changement.

            const updatedItinerary = new Itinerary({
                ...itinerary,
                gpx: URL.createObjectURL(file), // Ceci est juste pour la prévisualisation
            });
            onChange(updatedItinerary);
        }
    };

    return (
        <>
            <SectionTitle content="Itinéraire" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label>Point de départ</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label
                                        htmlFor="start-lat"
                                        className="text-sm"
                                    >
                                        Latitude
                                    </Label>
                                    <Input
                                        id="start-lat"
                                        type="number"
                                        step="0.000001"
                                        name="itinerary.start.latitude"
                                        value={itinerary.start.latitude || ''}
                                        onChange={handleStartLatChange}
                                        placeholder="44.947334"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="start-long"
                                        className="text-sm"
                                    >
                                        Longitude
                                    </Label>
                                    <Input
                                        id="start-long"
                                        type="number"
                                        step="0.000001"
                                        name="itinerary.start.longitude"
                                        value={itinerary.start.longitude || ''}
                                        onChange={handleStartLongChange}
                                        placeholder="6.383095"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label>Point d'arrivée</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label
                                        htmlFor="end-lat"
                                        className="text-sm"
                                    >
                                        Latitude
                                    </Label>
                                    <Input
                                        id="end-lat"
                                        type="number"
                                        step="0.000001"
                                        name="itinerary.end.latitude"
                                        value={itinerary.end.latitude || ''}
                                        onChange={handleEndLatChange}
                                        placeholder="44.922199"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="end-long"
                                        className="text-sm"
                                    >
                                        Longitude
                                    </Label>
                                    <Input
                                        id="end-long"
                                        type="number"
                                        step="0.000001"
                                        name="itinerary.end.longitude"
                                        value={itinerary.end.longitude || ''}
                                        onChange={handleEndLongChange}
                                        placeholder="6.359697"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="gpxFile">Fichier GPX</Label>
                        <Input
                            id="gpxFile"
                            type="file"
                            accept=".gpx"
                            className="mt-2"
                            onChange={handleGpxFileChange}
                        />
                    </div>

                    <div className="w-full h-[400px] rounded-md overflow-hidden">
                        {
                            <JourneyMap
                                start={itinerary.start}
                                end={itinerary.end}
                                gpxUrl={itinerary.gpx}
                            />
                        }
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default ItineraryForm;
