import { Airports } from "@/lib/airports";

import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/utils/ld-server";
import { fetchAirportsFromFastCache } from "@/fastCache";
import { fetchAirportsFromRedis } from "@/db/redis";
import Redis from "ioredis";
import { fetchAirportsFromPostgres } from "@/db/postgres";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const ldClient = await getServerClient();
    const context = getFlagContext();

    const enableFastCache = await ldClient.variation(
      "enableFastCache",
      context,
      false
    );
    if (enableFastCache) {
      console.log("Fetching data from FastCache");
      const allAirports = await fetchAirportsFromFastCache();
      return Response.json({ allAirports });
    }

    const flightDb = await ldClient.variation("flightDb", context, false);
    if (flightDb) {
      console.log("Fetching data from Postgres");

      const allAirports = await fetchAirportsFromPostgres();
      return Response.json({ allAirports });
    }

    console.log("Fetching data from Redis");
    const allAirports = await fetchAirportsFromRedis();
    return Response.json({ allAirports });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

const getFlagContext = () => {
  return {
    kind: "user",
    key: "jenn+" + Math.random().toString(36).substring(2, 5),
    name: "jenn toggles",
  };
};

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
