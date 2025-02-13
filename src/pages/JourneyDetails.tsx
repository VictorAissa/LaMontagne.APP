import { RootState } from '@/store/store';
import { getBackgroundImage } from '@/utils/image';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import snowflake from '@/assets/icons/season/snowflake.png';
import sun from '@/assets/icons/season/sun.png';
import { fetchJourneyById } from '@/store/features/journeySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface Props {}

const JourneyDetails = (props: Props) => {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const journey = useAppSelector(
        (state: RootState) => state.journey.currentJourney
    );

    useEffect(() => {
        if (id && (!journey || journey.id !== id)) {
            dispatch(fetchJourneyById(id));
        }
    }, [id]);

    return (
        <div className="flex flex-col w-full px-6">
            {/*             <div
                className="flex h-28 px-px bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: getBackgroundImage(journey, 24),
                }}
            > */}
            <div className="flex flex-col h-60 justify-center gap-7">
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
                        <p>{journey?.altitudes.max}</p>
                        <p>{journey?.altitudes.total}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneyDetails;
