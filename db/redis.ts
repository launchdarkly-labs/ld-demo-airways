import { fetchAirportsFromFastCache } from "@/fastCache";
import { ldClient } from "@/utils/ld-server/serverClient";
import { Span, trace } from "@opentelemetry/api";
import { Redis } from "ioredis";
import { LDContext } from "launchdarkly-node-server-sdk";

const redisClient = new Redis(process.env.REDIS_URL || "");

const tracer = trace.getTracer("redis");

export const fetchAirportsFromRedis = async (flagContext: LDContext) => {
  return tracer.startActiveSpan(
    "fetchAirportsFromRedis",
    async (span: Span) => {
      try {
        // First check to see if we should use FastCache
        const enableFastCache = await ldClient.boolVariation(
          "enableFastCache",
          flagContext,
          false
        );
        if (enableFastCache) {
          console.log("Fetching data from FastCache");
          const allAirports = await fetchAirportsFromFastCache();
          return allAirports;
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
