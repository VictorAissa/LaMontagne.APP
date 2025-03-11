import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/SectionTitle';
import JourneyMap from '@/components/JourneyMap';
import { Itinerary } from '@/types/Topo';
import { Label } from '@radix-ui/react-label';
import { Trash2, FileCheck, Map } from 'lucide-react';

interface ItineraryFormProps {
    itinerary: Itinerary;
    onChange: (itinerary: Itinerary) => void;
    onFilesChange: (files: File[]) => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
    itinerary,
    onChange,
    onFilesChange,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            setIsLoading(true);

            const updatedFiles = [...selectedFiles, file];
            setSelectedFiles(updatedFiles);

            // Créer une URL temporaire pour la prévisualisation
            const gpxPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(gpxPreviewUrl);

            onFilesChange(updatedFiles);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Simuler un délai de chargement pour l'aperçu
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    };

    const handleRemoveFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFiles([]);
        setPreviewUrl('');

        onFilesChange([]);
    };

    // Nettoyage de l'URL lors du démontage du composant
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

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

                    <div className="mb-6 relative">
                        <Label htmlFor="gpxFile">Fichier GPX</Label>
                        <Input
                            id="gpxFile"
                            ref={fileInputRef}
                            type="file"
                            accept=".gpx"
                            className="mt-2"
                            onChange={handleGpxFileChange}
                        />
                        {selectedFiles.length > 0 && (
                            <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <div className="flex items-center gap-2">
                                    <FileCheck
                                        size={18}
                                        className="text-green-500"
                                    />
                                    <span className="text-sm">
                                        {selectedFiles[0].name}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="w-full h-[400px] rounded-md overflow-hidden relative">
                        <JourneyMap
                            start={itinerary.start}
                            end={itinerary.end}
                            gpxUrl={previewUrl}
                        />

                        {isLoading && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                    <p className="text-sm font-medium">
                                        Chargement de la trace...
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isLoading && previewUrl && (
                            <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-md p-2 shadow-sm">
                                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                    <Map size={14} />
                                    <span>Trace GPX chargée</span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default ItineraryForm;
