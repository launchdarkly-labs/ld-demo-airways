import postgres from "postgres";
import { airports } from "@/schema/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { trace } from "@opentelemetry/api";
import { fetchAirportsFromFastCache } from "@/fastCache";
import { ldClient } from "@/utils/ld-server/serverClient";
import { LDContext } from "launchdarkly-node-server-sdk";

const tracer = trace.getTracer("postgres");

const pgConnectionString = process.env.DATABASE_URL;
if (!pgConnectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pgClient = postgres(pgConnectionString);

export const fetchAirportsFromPostgres = async (flagContext: LDContext) => {
  return tracer.startActiveSpan("fetchAirportsFromPostgres", async (span) => {
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

      // sleep for 150ms
      await new Promise((resolve) => setTimeout(resolve, 150));

      const db = drizzle(pgClient);
      const allAirports = await db.select().from(airports);

      return allAirports;
    } finally {
      span.end();
    }
  });
};
