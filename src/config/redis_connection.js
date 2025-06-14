import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://default:j1G4PM7OF2r5ho6597Jb4VuQ9lR9xxEH@redis-11653.crce181.sa-east-1-2.ec2.redns.redis-cloud.com:11653'
});

redisClient.on('error', err => console.error('Redis Client Error', err));


async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}


export { redisClient, connectRedis };
