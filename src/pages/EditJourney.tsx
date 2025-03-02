import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { journeyAdapter } from '../adapters/journeyAdapter';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { Journey } from '@/types/Journey';
import {
    fetchJourneyById,
    createJourney,
    updateJourney,
} from '@/store/features/journeySlice';
import SectionTitle from '@/components/SectionTitle';
import { Meteo } from '@/types/Meteo';
import { api } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import JourneyMap from '@/components/JourneyMap';
//import JourneyPicturesUpload from '@/components/JourneyPicturesUpload';

const EditJourney = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [meteo, setMeteo] = useState<Meteo | null>(null);
    const [meteoRequested, setMeteoRequested] = useState(false);
    const [formData, setFormData] = useState<Journey>(new Journey());
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const SEASONS = ['SUMMER', 'WINTER'];
    const SKY_OPTIONS = ['SUNNY', 'PARTLY_CLOUDY', 'CLOUDY', 'SNOW', 'RAIN'];
    const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

    const isNewJourney = !id;

    const journey = useAppSelector((state: RootState): Journey | null =>
        id ? journeyAdapter.fromJSON(state.journey.currentJourney) : null
    );

    const canRequestMeteo = () => {
        if (!formData.date) return false;
        const journeyDate = new Date(formData.date);
        const now = new Date();
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in  milliseconds
        return journeyDate.getTime() - now.getTime() <= oneWeek;
    };

    const getMeteo = async () => {
        try {
            if (
                !formData.itinerary?.end?.latitude ||
                !formData.itinerary?.end?.longitude
            ) {
                console.error('Coordonnées de fin manquantes');
                return;
            }

            const date = new Date(formData.date); // yyyy-MM-dd
            const formattedDate = date.toISOString().split('T')[0];

            const response = await api.getMeteoByCoordinates(
                formData.itinerary.end.latitude,
                formData.itinerary.end.longitude,
                formattedDate
            );

            if (response.error) {
                console.error(
                    'Erreur lors de la récupération des données météo:',
                    response.error
                );
                return;
            }

            const meteoData = new Meteo(response.data);
            setMeteo(meteoData);

            setFormData((prev) => ({
                ...prev,
                meteo: {
                    ...meteoData,
                },
            }));

            console.log('Données météo récupérées avec succès:', response.data);
        } catch (error) {
            console.error('Exception lors de la requête météo:', error);
        }
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchJourneyById(id))
                .unwrap()
                .then(() => setIsLoading(false))
                .catch((error) => {
                    console.error(
                        'Erreur lors du chargement de la course:',
                        error
                    );
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (journey && !formData.id) {
            setFormData(journey);
        }
    }, [formData.id, journey]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNestedInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        const parts = name.split('.');

        if (parts.length === 1) {
            // Champ simple
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            // Champ imbriqué
            setFormData((prev) => {
                const current = { ...prev };
                let temp = current;

                // Naviguer jusqu'au dernier niveau
                for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i];
                    if (!temp[part]) temp[part] = {};
                    temp[part] = { ...temp[part] };
                    temp = temp[part];
                }

                // Définir la valeur
                temp[parts[parts.length - 1]] = value;
                return current;
            });
        }
    };

    // Gestion des sélecteurs
    const handleSelectChange = (name: string, value: string) => {
        const parts = name.split('.');

        if (parts.length === 1) {
            // Champ simple
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            // Champ imbriqué
            setFormData((prev) => {
                let current = { ...prev };
                let temp = current;

                // Naviguer jusqu'au dernier niveau
                for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i];
                    if (!temp[part]) temp[part] = {};
                    temp[part] = { ...temp[part] };
                    temp = temp[part];
                }

                // Définir la valeur
                temp[parts[parts.length - 1]] = value;
                return current;
            });
        }
    };

    // Gestion des tableaux (comme members)
    const handleArrayChange = (name: string, value: string) => {
        const values = value.split(',').map((item) => item.trim());
        setFormData((prev) => ({
            ...prev,
            [name]: values,
        }));
    };

    // Soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const journeyData = { ...formData };

            // Conversion des types si nécessaire
            if (typeof journeyData.date === 'string') {
                journeyData.date = new Date(journeyData.date);
            }

            // Conversion des valeurs numériques
            if (journeyData.altitudes) {
                journeyData.altitudes.max = Number(journeyData.altitudes.max);
                journeyData.altitudes.min = Number(journeyData.altitudes.min);
                journeyData.altitudes.total = Number(
                    journeyData.altitudes.total
                );
            }

            if (journeyData.itinerary?.start) {
                journeyData.itinerary.start.latitude = Number(
                    journeyData.itinerary.start.latitude
                );
                journeyData.itinerary.start.longitude = Number(
                    journeyData.itinerary.start.longitude
                );
            }

            if (journeyData.itinerary?.end) {
                journeyData.itinerary.end.latitude = Number(
                    journeyData.itinerary.end.latitude
                );
                journeyData.itinerary.end.longitude = Number(
                    journeyData.itinerary.end.longitude
                );
            }

            if (journeyData.meteo?.temperature) {
                journeyData.meteo.temperature.max = Number(
                    journeyData.meteo.temperature.max
                );
                journeyData.meteo.temperature.min = Number(
                    journeyData.meteo.temperature.min
                );
            }

            if (journeyData.meteo?.iso) {
                journeyData.meteo.iso.day = Number(journeyData.meteo.iso.day);
                journeyData.meteo.iso.night = Number(
                    journeyData.meteo.iso.night
                );
            }

            if (journeyData.meteo?.wind) {
                journeyData.meteo.wind.speed = Number(
                    journeyData.meteo.wind.speed
                );
            }

            if (journeyData.meteo) {
                journeyData.meteo.bera = Number(journeyData.meteo.bera);
            }

            if (isNewJourney) {
                // Création d'une nouvelle course
                await dispatch(createJourney(journeyData)).unwrap();
            } else {
                // Mise à jour d'une course existante
                await dispatch(updateJourney({ id, ...journeyData })).unwrap();
            }

            navigate('/journeys');
        } catch (error) {
            console.error('Échec de la sauvegarde de la course:', error);
        }
    };

    // Annulation et retour à la liste des courses
    const handleCancel = () => {
        navigate('/journeys');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Chargement...
            </div>
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
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    placeholder="Nom de la course"
                    className="border-none text-2xl text-center"
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
                                    formData.date instanceof Date
                                        ? formData.date
                                              .toISOString()
                                              .split('T')[0]
                                        : formData.date || ''
                                }
                                onChange={handleInputChange}
                                required
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="season">Saison</Label>
                            <Select
                                value={formData.season || ''}
                                onValueChange={(value) =>
                                    handleSelectChange('season', value)
                                }
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

            {/* Section Membres */}
            <SectionTitle content="Participants" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <Label htmlFor="members">
                        Participants (séparés par des virgules)
                    </Label>
                    <Input
                        id="members"
                        name="members"
                        value={formData.members?.join(', ') || ''}
                        onChange={(e) =>
                            handleArrayChange('members', e.target.value)
                        }
                        placeholder="Maurice, Lionel, Louis..."
                        className="mt-2"
                    />
                </CardContent>
            </Card>

            {/* Section Photos */}
            <SectionTitle content="Photos" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    {/*                     <JourneyPicturesUpload
                        currentPictures={formData.pictures || []}
                        onUploadComplete={(urls) => {
                            setFormData((prev) => ({
                                ...prev,
                                pictures: [...(prev.pictures || []), ...urls],
                            }));
                        }}
                        onDeletePicture={(url) => {
                            setFormData((prev) => ({
                                ...prev,
                                pictures: (prev.pictures || []).filter(
                                    (pic) => pic !== url
                                ),
                            }));
                        }}
                    /> */}
                </CardContent>
            </Card>

            {/* Section Itinéraire */}
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
                                        value={
                                            formData.itinerary?.start
                                                ?.latitude || ''
                                        }
                                        onChange={handleNestedInputChange}
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
                                        value={
                                            formData.itinerary?.start
                                                ?.longitude || ''
                                        }
                                        onChange={handleNestedInputChange}
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
                                        value={
                                            formData.itinerary?.end?.latitude ||
                                            ''
                                        }
                                        onChange={handleNestedInputChange}
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
                                        value={
                                            formData.itinerary?.end
                                                ?.longitude || ''
                                        }
                                        onChange={handleNestedInputChange}
                                        placeholder="6.359697"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="gpxId">Fichier GPX</Label>
                        <Input
                            id="gpxId"
                            type="file"
                            accept=".gpx"
                            className="mt-2"
                            // Implémentation de l'upload GPX à ajouter
                        />
                    </div>

                    <div className="w-full h-[400px] rounded-md overflow-hidden">
                        {formData.itinerary?.start?.latitude &&
                            formData.itinerary?.end?.latitude && (
                                <JourneyMap
                                    start={formData.itinerary.start}
                                    end={formData.itinerary.end}
                                    gpxUrl={formData.itinerary?.gpx}
                                />
                            )}
                    </div>
                </CardContent>
            </Card>

            {/* Section Altitudes */}
            <SectionTitle content="Altitudes" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="alt-max">
                                Altitude maximale (m)
                            </Label>
                            <Input
                                id="alt-max"
                                type="number"
                                name="altitudes.max"
                                value={formData.altitudes?.max || ''}
                                onChange={handleNestedInputChange}
                                placeholder="4000"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="alt-min">
                                Altitude minimale (m)
                            </Label>
                            <Input
                                id="alt-min"
                                type="number"
                                name="altitudes.min"
                                value={formData.altitudes?.min || ''}
                                onChange={handleNestedInputChange}
                                placeholder="2000"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="alt-total">
                                Dénivelé total (m)
                            </Label>
                            <Input
                                id="alt-total"
                                type="number"
                                name="altitudes.total"
                                value={formData.altitudes?.total || ''}
                                onChange={handleNestedInputChange}
                                placeholder="2200"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section Météo */}
            <SectionTitle content="Météo" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex justify-end mb-4">
                        {canRequestMeteo() && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={getMeteo}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Mettre à jour la météo
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label htmlFor="meteo-sky">Conditions météo</Label>
                            <Select
                                value={formData.meteo?.sky || ''}
                                onValueChange={(value) =>
                                    handleSelectChange('meteo.sky', value)
                                }
                            >
                                <SelectTrigger id="meteo-sky" className="mt-2">
                                    <SelectValue placeholder="Sélectionner les conditions" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SKY_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option === 'SUNNY'
                                                ? 'Ensoleillé'
                                                : option === 'PARTLY_CLOUDY'
                                                ? 'Partiellement nuageux'
                                                : option === 'CLOUDY'
                                                ? 'Nuageux'
                                                : option === 'SNOW'
                                                ? 'Neige'
                                                : 'Pluie'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="meteo-bera">
                                Indice BERA (1-5)
                            </Label>
                            <Input
                                id="meteo-bera"
                                type="number"
                                min="1"
                                max="5"
                                name="meteo.bera"
                                value={formData.meteo?.bera || ''}
                                onChange={handleNestedInputChange}
                                placeholder="2"
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label>Températures (°C)</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label
                                        htmlFor="temp-top"
                                        className="text-sm"
                                    >
                                        Haut
                                    </Label>
                                    <Input
                                        id="temp-top"
                                        type="number"
                                        name="meteo.temperature.top"
                                        value={
                                            formData.meteo?.temperature?.max ||
                                            ''
                                        }
                                        onChange={handleNestedInputChange}
                                        placeholder="-5"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="temp-bottom"
                                        className="text-sm"
                                    >
                                        Bas
                                    </Label>
                                    <Input
                                        id="temp-bottom"
                                        type="number"
                                        name="meteo.temperature.bottom"
                                        value={
                                            formData.meteo?.temperature?.min ||
                                            ''
                                        }
                                        onChange={handleNestedInputChange}
                                        placeholder="5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label>ISO (m)</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label
                                        htmlFor="iso-day"
                                        className="text-sm"
                                    >
                                        Jour
                                    </Label>
                                    <Input
                                        id="iso-day"
                                        type="number"
                                        name="meteo.iso.day"
                                        value={formData.meteo?.iso?.day || ''}
                                        onChange={handleNestedInputChange}
                                        placeholder="3000"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="iso-night"
                                        className="text-sm"
                                    >
                                        Nuit
                                    </Label>
                                    <Input
                                        id="iso-night"
                                        type="number"
                                        name="meteo.iso.night"
                                        value={formData.meteo?.iso?.night || ''}
                                        onChange={handleNestedInputChange}
                                        placeholder="2000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Vent</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <Label
                                        htmlFor="wind-direction"
                                        className="text-sm"
                                    >
                                        Direction
                                    </Label>
                                    <Select
                                        value={
                                            formData.meteo?.wind?.direction ||
                                            ''
                                        }
                                        onValueChange={(value) =>
                                            handleSelectChange(
                                                'meteo.wind.direction',
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger id="wind-direction">
                                            <SelectValue placeholder="Direction" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {WIND_DIRECTIONS.map((dir) => (
                                                <SelectItem
                                                    key={dir}
                                                    value={dir}
                                                >
                                                    {dir}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label
                                        htmlFor="wind-speed"
                                        className="text-sm"
                                    >
                                        Vitesse (km/h)
                                    </Label>
                                    <Input
                                        id="wind-speed"
                                        type="number"
                                        name="meteo.wind.speed"
                                        value={
                                            formData.meteo?.wind?.speed || ''
                                        }
                                        onChange={handleNestedInputChange}
                                        placeholder="10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section Protections */}
            <SectionTitle content="Protections" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="mb-6">
                        <Label>Cordes</Label>
                        {/* Ici, il faudrait un système pour ajouter/supprimer des cordes */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <Label
                                    htmlFor="rope-diameter"
                                    className="text-sm"
                                >
                                    Diamètre (mm)
                                </Label>
                                <Input
                                    id="rope-diameter"
                                    type="number"
                                    step="0.1"
                                    name="protections.ropes[0].diameter"
                                    value={
                                        formData.protections?.ropes?.[0]
                                            ?.diameter || ''
                                    }
                                    onChange={handleNestedInputChange}
                                    placeholder="8.4"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="rope-length"
                                    className="text-sm"
                                >
                                    Longueur (m)
                                </Label>
                                <Input
                                    id="rope-length"
                                    type="number"
                                    name="protections.ropes[0].length"
                                    value={
                                        formData.protections?.ropes?.[0]
                                            ?.length || ''
                                    }
                                    onChange={handleNestedInputChange}
                                    placeholder="50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="nuts">Nombre de nuts</Label>
                            <Input
                                id="nuts"
                                type="number"
                                name="protections.nuts"
                                value={formData.protections?.nuts || ''}
                                onChange={handleNestedInputChange}
                                placeholder="0"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="cams">
                                Cams (tailles, séparées par des virgules)
                            </Label>
                            <Input
                                id="cams"
                                name="cams"
                                value={
                                    formData.protections?.cams?.join(', ') || ''
                                }
                                onChange={(e) =>
                                    handleArrayChange(
                                        'protections.cams',
                                        e.target.value
                                    )
                                }
                                placeholder="1.5, 3, 3"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="screws">
                                Nombre de vis à glace
                            </Label>
                            <Input
                                id="screws"
                                type="number"
                                name="protections.screws"
                                value={formData.protections?.screws || ''}
                                onChange={handleNestedInputChange}
                                placeholder="5"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section Observations */}
            <SectionTitle content="Observations" />
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <Textarea
                        name="miscellaneous"
                        value={formData.miscellaneous || ''}
                        onChange={handleInputChange}
                        placeholder="Notes, observations, conseils..."
                        className="min-h-32"
                    />
                </CardContent>
            </Card>
        </form>
    );
};

export default EditJourney;

/*             <div className="flex justify-center gap-4 mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="min-w-36 flex items-center gap-2"
                >
                    <X size={16} />
                    Annuler
                </Button>
                <Button
                    type="submit"
                    className="min-w-36 flex items-center gap-2"
                >
                    <Check size={16} />
                    {isNewJourney ? 'Créer */
