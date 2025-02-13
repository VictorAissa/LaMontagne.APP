import { useEffect, useMemo } from 'react';
import JourneyFiltersProps from '@/components/JourneyFilters';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    setJourneys,
    setStatus,
    setError,
    fetchUserJourneys,
} from '@/store/features/journeySlice';
import JourneyCard from '@/components/JourneyCard';
import { journeyAdapter } from '@/adapters/journeyAdapter';
import { Journey } from '@/types/Journey';

const Journeys = () => {
    const dispatch = useAppDispatch();

    const journeys = useAppSelector(
        (state: RootState) =>
            state.journey.journeys?.map((journey) =>
                journeyAdapter.fromJSON(journey)
            ) || []
    );
    const status = useAppSelector((state: RootState) => state.journey.status);
    const error = useAppSelector((state: RootState) => state.journey.error);
    const dateRange = useAppSelector(
        (state: RootState) => state.filters.dateRange
    );
    const userId = useAppSelector((state: RootState) => state.auth.userId);
    const season = useAppSelector((state: RootState) => state.filters.season);
    const token = useAppSelector((state: RootState) => state.auth.token);

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
        if (userId) {
            dispatch(fetchUserJourneys(userId));
        }
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
