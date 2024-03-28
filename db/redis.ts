import { fetchAirportsFromFastCache } from "@/fastCache";
import { ldClient } from "@/utils/ld-server/serverClient";
import { Span, trace } from "@opentelemetry/api";
import { Redis } from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL || "");

const tracer = trace.getTracer("redis");

export const fetchAirportsFromRedis = async () => {
  return tracer.startActiveSpan(
    "fetchAirportsFromRedis",
    async (span: Span) => {
      try {
        // First check to see if we should use FastCache
        const context = getFlagContext();
        const enableFastCache = await ldClient.boolVariation(
          "enableFastCache",
          context,
          false
        );
        if (enableFastCache) {
          console.log("Fetching data from FastCache");
          const allAirports = await fetchAirportsFromFastCache();
          return Response.json({ allAirports });
        }

        const airportsRedisJson = await redisClient.get("allAirports");
        const allAirports = JSON.parse(airportsRedisJson!);
        return allAirports;
      } finally {
        span.end();
      }
    }
  );
};

const getFlagContext = () => {
  return {
    kind: "user",
    key: "jenn+" + Math.random().toString(36).substring(2, 5),
    name: "jenn toggles",
  };
};
