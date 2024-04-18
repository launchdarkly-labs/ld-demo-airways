import getServerClient, {
  getFlagContext,
} from "@/utils/ld-server/serverClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const ldClient = await getServerClient();
    const context = getFlagContext();
    const errorRate = await ldClient.numberVariation(
      "random-err-rate",
      context,
      0.0
    );
    const potentialError = Math.random();
    if (potentialError < errorRate) {
      throw new Error("Random error");
    }
    return Response.json({
      errorRate,
      potentialError,
      contextKey: context.key,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
