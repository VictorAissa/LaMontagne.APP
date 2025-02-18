import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import snowflake from '@/assets/icons/season/snowflake.png';
import sun from '@/assets/icons/season/sun.png';
import arrow_top from '@/assets/icons/arrow_top.png';
import arrow_drop from '@/assets/icons/arrow_drop.png';
import { fetchJourneyById } from '@/store/features/journeySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import JourneyMembers from '@/components/JourneyMembers';
import JourneyCarousel from '@/components/JourneyCarousel';
import JourneyMap from '@/components/JourneyMap';
import SectionTitle from '@/components/SectionTitle';
import JourneyProtections from '@/components/JourneyProtections';
import JourneyMeteo from '@/components/JourneyMeteo';

const JourneyDetails = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const journey = useAppSelector(
        (state: RootState) => state.journey.currentJourney
    );
    const isLoading = !journey || (id && journey.id !== id);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id && (!journey || journey.id !== id)) {
            dispatch(fetchJourneyById(id));
        }
    }, [id]);

    return (
        <div className="flex flex-col w-full px-6 md:px-12 lg:px-24">
            <div className="flex flex-col h-60 justify-center gap-10 md:gap-14 ">
                <h1 className="flex w-full justify-center text-5xl">
                    {journey?.title ?? 'La course'}
                </h1>
                <div className="w-full flex justify-center">
                    <div className="flex justify-around items-center w-full max-w-3xl">
                        <img
                            src={journey?.season === 'SUMMER' ? sun : snowflake}
                            alt="Season icon"
                            className="h-8 w-8"
                        />
                        <div className="flex gap-0 items-center">
                            <img
                                src={arrow_top}
                                alt="mountain height icon"
                                className="h-8 w-8"
                            />
                            <p>{journey?.altitudes.max}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <img
                                src={arrow_drop}
                                alt="vretical drop icon"
                                className="h-8 w-8"
                            />
                            <p>{journey?.altitudes.total}</p>
                        </div>
                    </div>
                </div>
            </div>
            {journey?.pictures?.length && journey.pictures.length > 0 ? (
                <div className="w-full py-10 md:py-16 lg:py-24">
                    <JourneyCarousel journey={journey} />
                </div>
            ) : (
                <div className="flex justify-center items-center h-20">
                    😔 Pas de photos pour l'instant ...
                </div>
            )}
            <div className="w-full py-10 md:py-16">
                <JourneyMembers
                    members={journey?.members || ['toto', 'titi']}
                />
            </div>
            <div className="py-10 md:py-16">
                <SectionTitle content="Topo" />
                <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-md overflow-hidden">
                    {!isLoading && (
                        <JourneyMap
                            start={journey.itinerary?.start}
                            end={journey.itinerary?.end}
                            gpxUrl={journey.itinerary?.gpx}
                        />
                    )}
                </div>
            </div>
            <div className="w-full py-10 md:py-16">
                <SectionTitle content="Protections" />
                {!isLoading && (
                    <JourneyProtections protections={journey.protections} />
                )}
            </div>
            <div className="w-full py-10 md:py-16">
                <SectionTitle content="Météo" />
                {!isLoading && (
                    <JourneyMeteo
                        meteo={journey.meteo}
                        journeyDate={journey.date}
                        onUpdateClick={() =>
                            navigate(`/journey/edit/${journey.id}`)
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default JourneyDetails;
