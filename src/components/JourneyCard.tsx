import { Journey } from '@/types/Journey';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { useEffect, useState } from 'react';
import { getBackgroundImage, getMountainImages } from '@/utils/image';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentJourney } from '@/store/features/journeySlice';
import { journeyAdapter } from '@/adapters/journeyAdapter';

interface Props {
    index: number;
    journey: Journey;
}

const JourneyCard = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [cardHeight, setCardHeight] = useState('');

    const getHeight = (index: number) => {
        const heights = ['h-64', 'h-80', 'h-72', 'h-96'];
        return heights[index % heights.length];
    };

    const handleCardClick = () => {
        dispatch(setCurrentJourney(journeyAdapter.toJSON(props.journey)));
        navigate(`/journeys/${props.journey.id}`);
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
            setCardHeight(mobile ? 'aspect-[5/3]' : getHeight(props.index));
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [props.index]);

    return (
        <Card
            className={`group relative overflow-hidden cursor-pointer ${cardHeight}`}
            onClick={handleCardClick}
        >
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
                style={{
                    backgroundImage: getBackgroundImage(
                        props.journey,
                        props.index
                    ),
                }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

            <CardHeader className="relative h-full flex flex-col justify-end text-white p-6">
                <CardTitle className="text-xl mb-2">
                    {props.journey.title}
                </CardTitle>
                <CardContent className="p-0">
                    <div className="flex items-center gap-4 text-sm">
                        <span>
                            {new Date(props.journey.date).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded-full">
                            {props.journey.season === 'SUMMER'
                                ? 'Été'
                                : 'Hiver'}
                        </span>
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
    );
};

export default JourneyCard;
