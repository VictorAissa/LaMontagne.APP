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
import JourneyCard from '@/components/JourneyCard';
import { journeyAdapter } from '@/adapters/journeyAdapter';

const Journeys = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const journeys = useSelector((state: RootState) => 
        state.journey.journeys?.map(journey => journeyAdapter.fromJSON(journey)) || []
    );
    const status = useSelector((state: RootState) => state.journey.status);
    const error = useSelector((state: RootState) => state.journey.error);
    const dateRange = useSelector(
        (state: RootState) => state.filters.dateRange
    );
    const userId = useSelector((state: RootState) => state.auth.userId);
    const season = useSelector((state: RootState) => state.filters.season);
    const token = useSelector((state: RootState) => state.auth.token);

    const API_URL: ImportMetaEnv = import.meta.env.VITE_API_URL;

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
                const response = await fetch(
                    `${API_URL}/api/journey/user/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!response.ok) throw new Error('Failed to fetch journeys');
                const data = await response.json();
                /*                 const journeys = data.map(
                    (journey: Partial<Journey>) => new Journey(journey)
                ); */

                dispatch(setJourneys(data));
                dispatch(setStatus('succeeded'));
                console.log(data);
            } catch (error) {
                dispatch(setError(error.message));
                dispatch(setStatus('failed'));
            }
        };

        fetchJourneys();
    }, [API_URL, dispatch, userId]);

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
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 px-6 [column-fill:_balance] space-y-4">
                        {filteredJourneys.map((journey, index) => (
                            <div
                                key={journey.id}
                                className="break-inside-avoid mb-4"
                            >
                                <JourneyCard index={index} journey={journey} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journeys;
