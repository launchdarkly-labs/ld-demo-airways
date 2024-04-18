import { Airports } from "@/lib/airports";

import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/utils/ld-server";
import { fetchAirportsFromRedis } from "@/db/redis";
import Redis from "ioredis";
import { fetchAirportsFromPostgres } from "@/db/postgres";
import { getFlagContext } from "@/utils/ld-server/serverClient";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const ldClient = await getServerClient();
    const context = getFlagContext();

    // if flightDb is enabled, fetch data from Postgres. Otherwise, fetch from Redis.
    const flightDb = await ldClient.boolVariation("flightDb", context, false);
    if (flightDb) {
      console.log("Fetching data from Postgres");

      const allAirports = await fetchAirportsFromPostgres(context);
      return Response.json({ allAirports });
    }

    console.log("Fetching data from Redis");
    const allAirports = await fetchAirportsFromRedis(context);
    return Response.json({ allAirports });
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
