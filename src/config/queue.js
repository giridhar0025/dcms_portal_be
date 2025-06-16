const { Queue } = require('bullmq');
const Redis = require('ioredis');

let connection;
if (process.env.REDIS_URL) {
  connection = new Redis(process.env.REDIS_URL);
} else {
  console.warn('REDIS_URL not configured. Queue processing disabled.');
}

const emailQueue = connection ? new Queue('email', { connection }) : null;

async function connectQueue() {
  if (!connection) return;
  try {
    await connection.ping();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Redis connection error:', error);
    process.exit(1);
  }
}

module.exports = { emailQueue, connectQueue };
