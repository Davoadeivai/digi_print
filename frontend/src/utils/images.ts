export const FALLBACK_IMAGES = [
    '/images/download.jpeg',
    '/images/images.jpeg',
    ...Array.from({ length: 38 }, (_, i) => `/images/images (${i + 1}).jpeg`)
];

export const getRandomImage = (seed?: number) => {
    if (seed !== undefined) {
        return FALLBACK_IMAGES[seed % FALLBACK_IMAGES.length];
    }
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};

export const getCategoryImage = (categorySlug: string) => {
    // Map specific categories to specific images if needed, otherwise random
    const hash = categorySlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return getRandomImage(hash);
};
