const cache = new Map();

const CACHE_TTL = 5 * 60 * 1000;

export const getCachedData = (key) => {
    const cachedItem = cache.get(key);
    if (!cachedItem) return null;
    
    if (Date.now() - cachedItem.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }
    
    return cachedItem.data;
};

export const setCachedData = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

export const clearCache = () => {
    cache.clear();
}; 