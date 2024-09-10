import arcjet, { tokenBucket } from "@arcjet/next";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  characteristics: ["userId"], // track requests by a custom user ID
  rules: [
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      refillRate: 5, // refill 5 tokens per interval
      interval: 10, // refill every 10 seconds
      capacity: 10, // bucket maximum capacity of 10 tokens
    }),
  ],
});

export async function GET(req: Request) {
  const userId = "user123"; // Replace with your authenticated user ID
  const decision = await aj.protect(req, { userId, requested: 5 }); // Deduct 5 tokens from the bucket
  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 },
    );
  }

  return NextResponse.json({ message: "Hello world" });
}






export const POST = arcjet(async (req) => {
  const { celebrity, environment, userRole } = await req.json();
  
  // Define rate limits based on user role
  const rateLimits = {
    "Couch Potato": 3,
    "Survivalist Fanatic": 10,
    "Reality TV Producer": 20
  };

  // Apply rate limiting
  const rateLimit = rateLimits[userRole] || 3; // Default to Couch Potato if role is not recognized
  const result = await arcjet.rateLimit({
    key: userRole,
    limit: rateLimit,
    window: "1h"
  });

  if (!result.success) {
    return Response.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const prompt = `Generate a survival scenario for ${celebrity} in ${environment}.`;
  
  const output = await replicate.run(
    "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
    { input: { prompt } }
  );

  return Response.json({ scenario: output.join("") });
});
