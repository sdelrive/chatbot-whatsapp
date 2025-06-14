import { redisClient, connectRedis } from './config/redis_connection.js';

//  connect to redis
await connectRedis();

export class RedisHistory { 


    TTL_EN_SEGUNDOS = 60 * 60 * 1

    async getUserSession(userId) {
    const data = await redisClient.get(userId);

    const ttl = await redisClient.ttl(userId);
    console.log(`TTL restante para ${userId}: ${ttl} segundos`);


    return data ? JSON.parse(data) : [
        { role: 'system', content: 'Sos un asistente que recomienda ropa según el clima.' }
    ];
    }

    async saveUserSession(userId, messages) {

        

    await redisClient.set(userId, JSON.stringify(messages.slice(-10),  {
  EX: TTL_EN_SEGUNDOS
}));
    }

}