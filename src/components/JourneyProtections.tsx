import { Protections } from '@/types/Protection';
import screw from '@/assets/icons/stuff/ice-screw.png';
import rope from '@/assets/icons/stuff/rope.png';
import friend from '@/assets/icons/stuff/spring-loaded-camming-device.png';
import stopper from '@/assets/icons/stuff/stopper.png';

type ProtectionsSectionProps = {
    protections: Protections;
};

const JourneyProtections = ({ protections }: ProtectionsSectionProps) => {
    return (
        <section className="w-full">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-20">
                {/* Ropes */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                        <img src={rope} alt="Rope" className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        {protections.ropes.map((rope, index) => (
                            <div
                                key={`rope-specs-${index}`}
                                className="text-sm"
                            >
                                Ø{rope.diameter}mm - {rope.length}m
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cams */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                        <img src={friend} alt="Friend" className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        {protections.cams.map((size, index) => (
                            <div
                                key={`friend-size-${index}`}
                                className="text-sm"
                            >
                                #{size}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nuts */}
                <div className="flex flex-col items-center gap-2">
                    <img src={stopper} alt="Stopper" className="h-8 w-8" />
                    <span className="text-sm">
                        {protections.nuts}{' '}
                        {protections.nuts > 1 ? 'stoppers' : 'stopper'}
                    </span>
                </div>

                {/* Ice Screws */}
                <div className="flex flex-col items-center gap-2">
                    <img src={screw} alt="Ice screw" className="h-8 w-8" />
                    <span className="text-sm">
                        {protections.screws}{' '}
                        {protections.screws > 1 ? 'broches' : 'broche'}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default JourneyProtections;
