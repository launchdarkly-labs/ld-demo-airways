
import { airports } from '@/schema/schema';
import { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { Redis } from 'ioredis';
import { Airports } from '@/lib/airports';
import * as ld from '@launchdarkly/node-server-sdk';

export const dynamic = 'force-dynamic'

export async function GET(request: NextApiRequest, response: NextApiResponse) {
    const context = {
        "kind": 'user',
        "key": 'jenn+' + Math.random().toString(36).substring(2, 5),
        "name": 'jenn toggles'
    };
    const ldclient = ld.init(process.env.LD_SERVER_KEY || '');
    await ldclient.waitForInitialization();
    const flightDb = await ldclient.variation('flightDb', context, false);
    let connectionString;
    if (flightDb) {
        const t1 = Date.now()
        console.log('FlightDb Feature is Enabled');
        try {
            const redis = new Redis(process.env.REDIS_URL || '');
            const airportsRedisJson = await redis.get('allAirports');
            const allAirports = JSON.parse(airportsRedisJson!);
            const t2 = Date.now()
            console.log("Redis speed is: " + (t2 - t1) + "ms")
            const speed = (t2 - t1)

            ldclient.track("Airport DB Latency", context, null, speed)
            
            await ldclient.flush()
            return Response.json({ allAirports })
        } catch (error) {
            ldclient.track("Airport DB Errors", context)
            await ldclient.flush()
            console.log("error")
            return Response.json({ message: 'Pool went kaboom' })
        }
        
    } else {
        const t1 = Date.now()
        console.log('FlightDb is disabled');
        connectionString = process.env.DATABASE_URL
        try {
            if (!connectionString) {
                throw new Error('DATABASE_URL is not set')
            }
            const client = postgres(connectionString)
            const db = drizzle(client);
            const allAirports = await db.select().from(airports)
            const t2 = Date.now()
            console.log("PostgreSQL speed is: " + (t2 - t1) + "ms")
            const speed = (t2 - t1)
            ldclient.track("Airport DB Latency", context, null, speed)
            await ldclient.flush()
            client.CLOSE
            return Response.json({ allAirports })
        } catch (error) {
            ldclient.track("Airport DB Errors", context)
            await ldclient.flush()
            console.log("error")
            return Response.json({ message: 'Pool went kaboom' })
        }
    }
}

export async function POST(request: NextApiRequest, response: NextApiResponse) {
    try {
        const redis = new Redis(process.env.REDIS_URL || '');
        const airportsJson = JSON.stringify(Airports);
        redis.set('allAirports', airportsJson);
        const airportsRedisJson = await redis.get('allAirports');
        const airports = JSON.parse(airportsRedisJson!);
        return Response.json({ airports })
    } catch (error) {
        return Response.json({ message: 'Cant insert' })
    }
}

