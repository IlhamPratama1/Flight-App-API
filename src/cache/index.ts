import { createClient } from 'redis';

const DEFAULT_EXIPIRATION: number = 3600;
export const redisClient = createClient();

export async function getOrSetCache(key: string, cb: Function) {
    const data = await redisClient.get(key);
    if (data) return JSON.parse(data);
    const newData = await cb();
    redisClient.setEx(key, DEFAULT_EXIPIRATION, JSON.stringify(newData));
    return newData;
}