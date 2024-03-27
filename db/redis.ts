import { Redis } from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL || "");

export const fetchAirportsFromRedis = async () => {
  const airportsRedisJson = await redisClient.get("allAirports");
  const allAirports = JSON.parse(airportsRedisJson!);
  return allAirports;
};
