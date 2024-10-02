import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  const { celebrity, environment, promptConfig } = await req.json();
  
  const prompt = promptConfig?.prompt || `Generate a survival scenario in 500 characters or less for ${celebrity} in ${environment}.`;
  
  const output = await replicate.run(
    promptConfig?.model || "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
    { input: { prompt } }
  );

  return NextResponse.json({ scenario: output.join("") });
}