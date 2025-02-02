import { useEffect, useMemo } from 'react';
import JourneyFiltersProps from '@/components/JourneyFilters';
import { Journey } from '@/types/Journey';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store/store';
import {
    setJourneys,
    setStatus,
    setError,
} from '@/store/features/journeySlice';

const Journeys = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const journeys = useSelector((state: RootState) => state.journey.journeys);
    const status = useSelector((state: RootState) => state.journey.status);
    const error = useSelector((state: RootState) => state.journey.error);
    const dateRange = useSelector(
        (state: RootState) => state.filters.dateRange
    );

    const season = useSelector((state: RootState) => state.filters.season);

    const filteredJourneys = useMemo(() => {
        if (!journeys) return [];
        let filtered = [...journeys];

        if (dateRange?.from && dateRange?.to) {
            filtered = filtered.filter((journey) => {
                const journeyDate = new Date(journey.date);
                return (
                    journeyDate >= new Date(dateRange.from!) &&
                    new Date(dateRange.to!)
                );
            });
        }

        if (season) {
            filtered = filtered.filter((journey) => journey.season === season);
        }

        return filtered;
    }, [journeys, dateRange, season]);

    useEffect(() => {
        const fetchJourneys = async () => {
            dispatch(setStatus('loading'));
            try {
                const response = await fetch('/api/journeys');
                if (!response.ok) throw new Error('Failed to fetch journeys');
                const data = await response.json();
                const journeys = data.map(
                    (journey: Partial<Journey>) => new Journey(journey)
                );

                dispatch(setJourneys(journeys));
                dispatch(setStatus('succeeded'));
            } catch (error) {
                dispatch(setError(error.message));
                dispatch(setStatus('failed'));
            }
        };

        fetchJourneys();
    }, [dispatch]);

    /*     if (status === 'loading') {
        return <div>Chargement...</div>;
    }

    if (status === 'failed') {
        return (
            <div className="text-red-500">Erreur{error && `: ${error}`}</div>
        ); // message composant
    } */

    return (
        <div className="container mx-auto">
            <div className="flex flex-col gap-6">
                <JourneyFiltersProps />

                {status === 'loading' ? (
                    <div>Chargement...</div>
                ) : status === 'failed' ? (
                    <div className="text-red-500">
                        Erreur{error && `: ${error}`}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredJourneys.map((journey) => (
                            <div
                                key={journey.id}
                                className="p-4 border rounded-lg shadow-sm"
                            >
                                <h3 className="font-semibold">
                                    {journey.title}
                                </h3>
                                <p>
                                    {new Date(
                                        journey.date
                                    ).toLocaleDateString()}
                                </p>
                                <p>{journey.season}</p>
                                {/* Ajoute d'autres infos que tu veux afficher */}
                            </div>
                        ))}
                    </div>
                )}
                {/* Affichage des journeys filtrés */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredJourneys.map((journey) => (
                        <div
                            key={journey.id}
                            className="p-4 border rounded-lg shadow-sm"
                        >
                            <h3 className="font-semibold">{journey.title}</h3>
                            <p>{new Date(journey.date).toLocaleDateString()}</p>
                            <p>{journey.season}</p>
                            {/* Ajoute d'autres infos que tu veux afficher */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Journeys;
