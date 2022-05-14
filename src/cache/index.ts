import { createClient } from 'redis';

const DEFAULT_EXIPIRATION: number = 3600;
export const redisClient = createClient({
    socket: {
        port: 6379,
        host: 'redis-cache'
    }
});

export async function getOrSetCache(key: string, cb: Function) {
    const data = await redisClient.get(key);
    if (data) return JSON.parse(data);
    const newData = await cb();
    await redisClient.setEx(key, DEFAULT_EXIPIRATION, JSON.stringify(newData));
    return newData;
}

export async function setCacheData<T>(key: string, newData: T) {
    await redisClient.setEx(key, DEFAULT_EXIPIRATION, JSON.stringify(newData));
    return newData;
}

export async function getCacheData(key: string) {
    const data = await redisClient.get(key);
    if (data) return JSON.parse(data);
}

export async function deleteCacheData(key: string) {
    await redisClient.del(key);
}