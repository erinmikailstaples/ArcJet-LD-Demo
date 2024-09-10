import arcjet, { tokenBucket } from "@arcjet/next";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export async function GET(req) {
  const userId = "user123";
  const decision = await aj.protect(req, { userId, requested: 5 });
  console.log("Arcjet decision", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 },
    );
  }

  return NextResponse.json({ message: "Hello world" });
}

export async function POST(req) {
  const { celebrity, environment, userRole } = await req.json();
  
  const result = await aj.protect(req, { userId: userRole, requested: 1 });

  if (result.isDenied()) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const prompt = `Generate a survival scenario for ${celebrity} in ${environment}.`;
  
  const output = await replicate.run(
    "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
    { input: { prompt } }
  );

  return NextResponse.json({ scenario: output.join("") });
}
