const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const emailQueue = new Queue('email', { connection });

async function connectQueue() {
  try {
    await connection.ping();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Redis connection error:', error);
    process.exit(1);
  }
}

module.exports = { emailQueue, connectQueue };
