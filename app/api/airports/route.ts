import { airports } from "@/schema/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Redis } from "ioredis";
import { Airports } from "@/lib/airports";

import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/utils/ld-server";
import { fetchFlightsFromFastCache } from "@/fastCache";

export const dynamic = "force-dynamic";

const pgConnectionString = process.env.DATABASE_URL;
if (!pgConnectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pgClient = postgres(pgConnectionString);
const redisClient = new Redis(process.env.REDIS_URL || "");

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const ldClient = await getServerClient();
    const context = {
      kind: "user",
      key: "jenn+" + Math.random().toString(36).substring(2, 5),
      name: "jenn toggles",
    };

    const enableFastCache = await ldClient.variation(
      "enableFastCache",
      context,
      false
    );
    if (enableFastCache) {
      console.log("Fetching data from FastCache");
      const allAirports = await fetchFlightsFromFastCache();
      return Response.json({ allAirports });
    }

    const flightDb = await ldClient.variation("flightDb", context, false);
    if (flightDb) {
      console.log("FlightDb is enabled. Fetching data from Postgres");

      const db = drizzle(pgClient);
      const allAirports = await db.select().from(airports);
      return Response.json({ allAirports });
    } else {
      console.log("FlightDb is disabled. Fetching data from Redis.");

      const airportsRedisJson = await redisClient.get("allAirports");
      const allAirports = JSON.parse(airportsRedisJson!);
      return Response.json({ allAirports });
    }
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const redis = new Redis(process.env.REDIS_URL || "");
    const airportsJson = JSON.stringify(Airports);
    redis.set("allAirports", airportsJson);
    const airportsRedisJson = await redis.get("allAirports");
    const airports = JSON.parse(airportsRedisJson!);
    return Response.json({ airports });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
