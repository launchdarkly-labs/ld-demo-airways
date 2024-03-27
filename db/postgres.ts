import postgres from "postgres";
import { airports } from "@/schema/schema";
import { drizzle } from "drizzle-orm/postgres-js";

const pgConnectionString = process.env.DATABASE_URL;
if (!pgConnectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pgClient = postgres(pgConnectionString);

export const fetchAirportsFromPostgres = async () => {
  // sleep for 150ms
  await new Promise((resolve) => setTimeout(resolve, 150));

  const db = drizzle(pgClient);
  const allAirports = await db.select().from(airports);
  return allAirports;
};
