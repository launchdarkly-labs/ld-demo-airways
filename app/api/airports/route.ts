import { airports } from "@/schema/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Redis } from "ioredis";
import { Airports } from "@/lib/airports";
import * as ld from "@launchdarkly/node-server-sdk";
import { TracingHook } from "@launchdarkly/node-server-sdk-otel";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const context = {
      kind: "user",
      key: "jenn+" + Math.random().toString(36).substring(2, 5),
      name: "jenn toggles",
    };
    const ldclient = ld.init(process.env.LD_SERVER_KEY || "", {
      hooks: [new TracingHook({ spans: false })],
    });
    await ldclient.waitForInitialization();
    const flightDb = await ldclient.variation("flightDb", context, false);
    let connectionString;
    if (flightDb) {
      console.log("FlightDb is enabled");
      connectionString = process.env.DATABASE_URL;

      if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
      }
      const client = postgres(connectionString);
      const db = drizzle(client);
      const allAirports = await db.select().from(airports);
      return Response.json({ allAirports });
    } else {
      console.log("FlightDb is disabled");

      const redis = new Redis(process.env.REDIS_URL || "");
      const airportsRedisJson = await redis.get("allAirports");
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
