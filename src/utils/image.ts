import { Journey } from "@/types/Journey";

const getMountainImages = () => {
    const images = import.meta.glob('/public/mountain/*.webp', {
        eager: true,
        import: 'default',
    });

    return Object.keys(images).map(path => 
        path.replace('/public', '')
    );
};

const getBackgroundImage = (journey: Journey | null | undefined, index: number) => {
    const defaultImages = getMountainImages();
    const getDefaultImage = () => {
        const defaultImageIndex = index % defaultImages.length;
        return `url(${defaultImages[defaultImageIndex]})`;
    };

    if (!journey?.pictures?.[0]) {
        return getDefaultImage();
    }

    return `url(${journey.pictures[0]})`;
};

const avatarImages = import.meta.glob('/public/animals/*.{png,jpg,jpeg}', {
    eager: true,
    as: 'url'
});

const getAvatarImage = (index: number): string => {
    const images = Object.values(avatarImages);
    return images[index % images.length];
};

export { getMountainImages, getBackgroundImage, getAvatarImage };