export const FALLBACK_IMAGES = [
    '/images/download.jpeg',
    '/images/images.jpeg',
    ...Array.from({ length: 38 }, (_, i) => `/images/images (${i + 1}).jpeg`)
];

/**
 * برمی‌گرداند یک تصویر از لیست FALLBACK_IMAGES
 * اگر seed داده شود، تصویر ثابت انتخاب می‌شود
 */
export const getRandomImage = (seed?: number) => {
    if (seed !== undefined) {
        // مطمئن شویم index منفی نشود
        const index = ((seed % FALLBACK_IMAGES.length) + FALLBACK_IMAGES.length) % FALLBACK_IMAGES.length;
        return FALLBACK_IMAGES[index];
    }
    // انتخاب تصادفی
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};

/**
 * برمی‌گرداند تصویر مناسب برای دسته‌بندی
 * اگر categorySlug خالی باشد، یک تصویر تصادفی می‌دهد
 */
export const getCategoryImage = (categorySlug?: string) => {
    if (!categorySlug) return getRandomImage();
    const hash = categorySlug
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return getRandomImage(hash);
};
