import { arcjet } from "../arcjet";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
