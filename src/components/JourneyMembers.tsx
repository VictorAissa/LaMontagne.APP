import { useRef, useLayoutEffect } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarImage } from '@/utils/image';

gsap.registerPlugin(ScrollTrigger);

interface JourneyMembersProps {
    members: string[];
}

const JourneyMembers = ({ members }: JourneyMembersProps) => {
    const membersRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (membersRef.current) {
            const memberElements =
                membersRef.current.querySelectorAll('.member-item');
            gsap.set(memberElements, { opacity: 0 });

            const ctx = gsap.context(() => {
                memberElements.forEach((member: Element, index: number) => {
                    gsap.fromTo(
                        member,
                        {
                            opacity: 0,
                            scale: 0.8,
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.4,
                            delay: index * 0.15,
                            ease: 'back.out(1.7)',
                            scrollTrigger: {
                                trigger: membersRef.current,
                                start: 'top 70%',
                                toggleActions: 'play none none none',
                            },
                        }
                    );
                });
            }, membersRef);

            return () => ctx.revert();
        }
    }, [members]);

    return (
        <section ref={membersRef} className="w-full">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {members?.map((member, index) => (
                    <div
                        key={`${member}-${index}`}
                        className="member-item flex flex-col items-center gap-2"
                    >
                        <Avatar className="h-20 w-20">
                            <AvatarImage
                                src={getAvatarImage(index)}
                                alt={member}
                            />
                            <AvatarFallback>
                                {member.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span>{member}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JourneyMembers;
