import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { journeyAdapter } from '../adapters/journeyAdapter';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { Journey } from '@/types/Journey';
import { fetchJourneyById } from '@/store/features/journeySlice';
import SectionTitle from '@/components/SectionTitle';
import JourneyMeteo from '@/components/JourneyMeteo';
import { Meteo } from '@/types/Meteo';
import { useSelector } from 'react-redux';
import { api } from '@/services/api';

const EditJourney = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [meteo, setMeteo] = useState<Meteo | null>(null);
    const [meteoRequested, setMeteoRequested] = useState(false);

    const journey = useAppSelector((state: RootState): Journey | null =>
        id ? journeyAdapter.fromJSON(state.journey.currentJourney) : null
    );

    const getMeteo = async () => {
        try {
            if (!journey) {
                console.error('Aucun voyage sélectionné');
                return;
            }

            // Formatage de la date au format yyyy-MM-dd
            const date = new Date(journey.date);
            const formattedDate = date.toISOString().split('T')[0]; // Format yyyy-MM-dd

            console.log('Début de la requête météo');
            console.log('Paramètres:', {
                latitude: journey.itinerary?.end?.latitude || 0,
                longitude: journey.itinerary?.end?.longitude || 0,
                date: formattedDate,
            });

            const response = await api.getMeteoByCoordinates(
                journey.itinerary?.end?.latitude || 0,
                journey.itinerary?.end?.longitude || 0,
                formattedDate
            );

            console.log("Réponse de l'API météo:", response);

            if (response.error) {
                console.error(
                    'Erreur lors de la récupération des données météo:',
                    response.error
                );
                return;
            }

            setMeteo(new Meteo(response.data));
            console.log('Données météo récupérées avec succès:', response.data);
        } catch (error) {
            console.error('Exception lors de la requête météo:', error);
        }
    };

    const isLoading = id && (!journey || journey.id !== id);
    const isNewJourney = !id;

    useEffect(() => {
        //window.scrollTo(0, 0);
        /*         if (isLoading) {
            dispatch(fetchJourneyById(id));
        } */
        if (journey && !meteoRequested) {
            getMeteo();
            setMeteoRequested(true);
        }
    }, [journey, meteoRequested]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isNewJourney) {
                // Logique de création
                // await dispatch(createJourney(formData)).unwrap();
            } else {
                // Logique de mise à jour
                // await dispatch(updateJourney({ id, ...formData })).unwrap();
            }
            navigate('/journeys');
        } catch (error) {
            console.error('Failed to save journey:', error);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="w-full py-10 md:py-16">
                    <SectionTitle
                        content={
                            isNewJourney
                                ? 'Nouvelle course'
                                : 'Édition de la course'
                        }
                    />
                </div>

                <div className="w-full py-10 md:py-16">
                    <SectionTitle content="Météo" />
                    {meteo && journey && (
                        <JourneyMeteo
                            meteo={meteo}
                            journeyDate={journey.date}
                            onUpdateClick={() =>
                                navigate(`/journey/edit/${journey?.id}`)
                            }
                        />
                    )}
                </div>

                {/* Sections du formulaire à implémenter */}

                <div className="w-full py-10 md:py-16 flex justify-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        Annuler
                    </Button>
                    <Button type="submit">
                        {isNewJourney ? 'Créer' : 'Mettre à jour'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditJourney;
