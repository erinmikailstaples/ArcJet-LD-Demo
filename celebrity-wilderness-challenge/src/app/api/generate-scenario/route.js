import { arcjet } from "../arcjet";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const POST = arcjet(async (req) => {
  const { celebrity, environment } = await req.json();
  const prompt = `Generate a survival scenario for ${celebrity} in ${environment}.`;
  
  const output = await replicate.run(
    "replicate/llama-2-70b-chat:2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
    { input: { prompt } }
  );

  return Response.json({ scenario: output.join("") });
});
