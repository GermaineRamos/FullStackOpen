const redis = require('redis');
const { promisify } = require('util');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = redis.createClient(REDIS_URL);

client.on('error', (err) => console.log('Redis Error', err));
client.on('connect', () => console.log('Connected to Redis'));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  getAsync,
  setAsync,
  client
};
