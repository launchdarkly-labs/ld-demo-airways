import postgres from "postgres";
import { airports } from "@/schema/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { trace } from "@opentelemetry/api";
import { fetchAirportsFromFastCache } from "@/fastCache";
import { ldClient } from "@/utils/ld-server/serverClient";

const tracer = trace.getTracer("postgres");

const pgConnectionString = process.env.DATABASE_URL;
if (!pgConnectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pgClient = postgres(pgConnectionString);

export const fetchAirportsFromPostgres = async () => {
  return tracer.startActiveSpan("fetchAirportsFromPostgres", async (span) => {
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

    // sleep for 150ms
    await new Promise((resolve) => setTimeout(resolve, 150));

    const db = drizzle(pgClient);
    const allAirports = await db.select().from(airports);

    span.end();
    return allAirports;
  });
};

const getFlagContext = () => {
  return {
    kind: "user",
    key: "jenn+" + Math.random().toString(36).substring(2, 5),
    name: "jenn toggles",
  };
};
