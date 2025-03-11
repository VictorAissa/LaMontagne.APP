import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/SectionTitle';
import { Journey } from '@/types/Journey';
import {
    fetchJourneyById,
    createJourney,
    updateJourney,
} from '@/store/features/journeySlice';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-label';
import PhotosForm from '@/components/form/PhotosForm';
import ItineraryForm from '@/components/form/ItineraryForm';
import { Altitudes, Itinerary } from '@/types/Topo';
import AltitudesForm from '@/components/form/AltitudesForm';
import MeteoForm from '@/components/form/MeteoForm';
import { Meteo } from '@/types/Meteo';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ProtectionsForm from '@/components/form/ProtectionsForm';
import { Protections } from '@/types/Protection';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EditJourney = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [isFetchLoading, setIsFetchLoading] = useState(true);
    const [fetchingJourneyError, setFetchingJourneyError] =
        useState<string>('');
    const [isValidationLoading, setIsValidationLoading] =
        useState<boolean>(false);
    const [validationError, setValidationError] = useState<string>('');

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [journey, setJourney] = useState<Journey>(new Journey());

    const SEASONS = ['SUMMER', 'WINTER'];
    const isNewJourney = !id;

    const journeyFromStore = useAppSelector((state) =>
        id ? state.journey.currentJourney : null
    );

    useEffect(() => {
        if (id && !journeyFromStore) {
            setFetchingJourneyError('');
            dispatch(fetchJourneyById(id))
                .unwrap()
                .then(() => setIsFetchLoading(false))
                .catch((error) => {
                    setFetchingJourneyError(error);
                    setIsFetchLoading(false);
                });
        } else {
            setIsFetchLoading(false);
        }
    }, [id, dispatch, journeyFromStore]);

    useEffect(() => {
        if (journeyFromStore && isFetchLoading) {
            setJourney(new Journey(journeyFromStore));
        }
    }, [journeyFromStore]);

    useEffect(() => {
        console.log(journey);
    }, [journey]);

    useEffect(() => {
        console.log(selectedFiles);
    }, [selectedFiles]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.title = e.target.value;
            return updated;
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.date = new Date(e.target.value);
            return updated;
        });
    };

    const handleSeasonChange = (value: string) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.season = value as 'SUMMER' | 'WINTER';
            return updated;
        });
    };

    const handleMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.members = e.target.value.split(',').map((m) => m.trim());
            return updated;
        });
    };

    const handlePhotosChange = (photos: string[]) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.pictures = photos;
            return updated;
        });
    };

    const handleFilesChange = (files: File[]) => {
        setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    };

    const handleItineraryChange = (itinerary: Itinerary) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.itinerary = itinerary;
            return updated;
        });
    };

    const handleAltitudesChange = (altitudes: Altitudes) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.altitudes = altitudes;
            return updated;
        });
    };

    const handleMeteoChange = (meteo: Meteo) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.meteo = meteo;
            console.log('Journey après mise à jour:', updated);
            return updated;
        });
    };

    const handleProtectionsChange = (protections: Protections) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.protections = protections;
            return updated;
        });
    };

    const handleMiscellaneousChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setJourney((current) => {
            const updated = new Journey(current);
            updated.miscellaneous = e.target.value;
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsValidationLoading(true);
        setValidationError('');

        try {
            if (isNewJourney) {
                await dispatch(
                    createJourney({
                        journeyData: journey,
                        files: selectedFiles,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    updateJourney({
                        journeyData: journey,
                        files: selectedFiles,
                    })
                ).unwrap();
            }

            navigate('/journeys');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setValidationError(error.message);
            } else {
                setValidationError(String(error));
            }
        } finally {
            setIsValidationLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/journeys');
    };

    if (isFetchLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Chargement...
            </div>
        );
    }

    if (!isFetchLoading && fetchingJourneyError) {
        return (
            <Alert variant="destructive" className="my-4 mx-6 w-auto">
                <AlertDescription>
                    Erreur pendant la récupération de la course :{' '}
                    {fetchingJourneyError}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full px-6 md:px-12 lg:px-24 pb-24"
        >
            {/* En-tête et titre */}
            <div className="flex flex-col justify-center py-8 md:py-12">
                <Input
                    name="title"
                    value={journey.title}
                    onChange={handleTitleChange}
                    placeholder="Nom de la course"
                    className="border-none text-2xl md:text-2xl text-center"
                    required
                />
            </div>

            {/* Section Date et Saison */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                name="date"
                                value={
                                    journey.date instanceof Date
                                        ? journey.date
                                              .toISOString()
                                              .split('T')[0]
                                        : ''
                                }
                                onChange={handleDateChange}
                                required
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="season">Saison</Label>
                            <Select
                                value={journey.season}
                                onValueChange={handleSeasonChange}
                            >
                                <SelectTrigger id="season" className="mt-2">
                                    <SelectValue placeholder="Choisir une saison" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SEASONS.map((season) => (
                                        <SelectItem key={season} value={season}>
                                            {season === 'SUMMER'
                                                ? 'Été'
                                                : 'Hiver'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section Membres*/}
            <SectionTitle content="Participants" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <Label htmlFor="members">
                        Participants (séparés par des virgules)
                    </Label>
                    <Input
                        id="members"
                        name="members"
                        value={journey.members.join(', ')}
                        onChange={handleMembersChange}
                        placeholder="Maurice, Lionel, Louis..."
                        className="mt-2"
                    />
                </CardContent>
            </Card>

            {/* Section Photos */}
            <SectionTitle content="Photos" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <PhotosForm
                        existingPhotos={journey.pictures}
                        onPhotosChange={handlePhotosChange}
                        onFilesChange={handleFilesChange}
                    />
                </CardContent>
            </Card>

            <ItineraryForm
                itinerary={journey.itinerary}
                onChange={handleItineraryChange}
                onFilesChange={handleFilesChange}
            />

            <AltitudesForm
                altitudes={journey.altitudes}
                onChange={handleAltitudesChange}
            />

            <MeteoForm
                meteo={journey.meteo}
                onChange={handleMeteoChange}
                date={journey.date}
                coordinates={{
                    latitude: journey.itinerary.end.latitude,
                    longitude: journey.itinerary.end.longitude,
                }}
            />

            <ProtectionsForm
                protections={journey.protections}
                onChange={handleProtectionsChange}
            />

            {/* Section Observations */}
            <SectionTitle content="Observations" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <Textarea
                        name="miscellaneous"
                        value={journey.miscellaneous}
                        onChange={handleMiscellaneousChange}
                        placeholder="Notes, observations, conseils..."
                        className="min-h-32 border-none"
                    />
                </CardContent>
            </Card>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4 mt-8">
                {!isValidationLoading && validationError && (
                    <Alert className="mx-6 w-auto text-red-500">
                        <AlertDescription>
                            Il y a eu une erreur à l'enregistrement :{' '}
                            {validationError}
                        </AlertDescription>
                    </Alert>
                )}
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isValidationLoading}
                    onClick={handleCancel}
                >
                    Annuler
                </Button>
                <Button type="submit" disabled={isValidationLoading}>
                    {isValidationLoading ? 'Sauvegarder...' : 'Sauvegarder'}
                </Button>
            </div>
        </form>
    );
};

export default EditJourney;
