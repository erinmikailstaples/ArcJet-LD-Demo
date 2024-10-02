import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const dynamic = 'force-dynamic'; // Add this line

export async function POST(req) {
  try {
    const { celebrity, environment, promptConfig } = await req.json();
  
    console.log("Received request with:", { celebrity, environment, promptConfig });
  
    const prompt = promptConfig?.prompt 
      ? promptConfig.prompt.replace('{celebrity}', celebrity).replace('{environment}', environment)
      : `Generate a survival scenario in 500 characters or less for ${celebrity} in ${environment}.`;
  
    console.log("Generated prompt:", prompt);

    const output = await replicate.run(
      promptConfig?.model || "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
      { input: { prompt } }
    );

    console.log("AI output:", output);

    return NextResponse.json({ scenario: output.join("") });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}