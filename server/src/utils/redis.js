import { Redis } from 'ioredis';
require("dotenv").config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log(`Redis is connected successfully!`);
    return process.env.REDIS_URL;
  }
  throw new Error('Redis connection failed!');
};

const redis = new Redis(redisClient());

// Error handling for the Redis client
redis.on('error', (err) => {
  console.error('[ioredis] Unhandled error event:', err);
});

export { redis };
