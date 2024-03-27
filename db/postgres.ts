import postgres from "postgres";
import { airports } from "@/schema/schema";
import { drizzle } from "drizzle-orm/postgres-js";

const pgConnectionString = process.env.DATABASE_URL;
if (!pgConnectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pgClient = postgres(pgConnectionString);

export const fetchAirportsFromPostgres = async () => {
  const db = drizzle(pgClient);
  const allAirports = await db.select().from(airports);
  return allAirports;
};
