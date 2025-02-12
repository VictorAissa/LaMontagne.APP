import { RootState } from '@/store/store';
import { getBackgroundImage } from '@/utils/image';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

interface Props {}

const JourneyDetails = (props: Props) => {
    const { id } = useParams();
    const journey = useSelector(
        (state: RootState) => state.journey.currentJourney
    );
    const dispatch = useDispatch();

    /*     useEffect(() => {
        if (!journey || journey.id !== id) {
            dispatch(fetchJourneyById(id));
        }
    }, [id]); */

    return (
        <div className="flex flex-col w-full px-6">
{/*             <div
                className="flex h-28 px-px bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: getBackgroundImage(journey, 24),
                }}
            > */}
            <div>
            <h1 className="">{journey?.title ?? 'La course'}</h1>

            </div>

        </div>
    );
};

export default JourneyDetails;
