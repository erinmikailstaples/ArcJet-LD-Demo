import { arcjet } from "@arcjet/next";

export function createArcjet() {
  return arcjet({
    apiKey: process.env.ARCJET_API_KEY,
  });
}