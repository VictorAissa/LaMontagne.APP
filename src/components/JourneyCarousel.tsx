import { Journey } from '@/types/Journey';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from './ui/carousel';

interface JourneyCarouselProps {
    journey: Journey;
}

const JourneyCarousel = ({ journey }: JourneyCarouselProps) => {
    return (
        <Carousel className="w-full">
            <CarouselContent className="">
                {journey.pictures.map((picture, index) => (
                    <CarouselItem
                        key={`${picture}-index${index}`}
                        className={`
                                        ${
                                            journey.pictures.length === 1
                                                ? 'basis-full max-w-[600px]'
                                                : journey.pictures.length === 2
                                                ? 'basis-full md:basis-1/2 max-w-[600px]'
                                                : 'basis-full md:basis-1/2 lg:basis-1/3 max-w-[600px]'
                                        }
                                    `}
                    >
                        <div className="mx-auto w-full max-w-[600px]">
                            <div className="relative aspect-[5/3] w-full overflow-hidden rounded-sm">
                                <img
                                    src={picture}
                                    alt="journey user picture"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious
                className={`
                                ${journey.pictures.length === 1 && 'hidden'}
                                left-2
                            `}
            />
            <CarouselNext
                className={`
                            ${journey.pictures.length === 1 && 'hidden'}
                            right-2
                        `}
            />
        </Carousel>
    );
};

export default JourneyCarousel;
