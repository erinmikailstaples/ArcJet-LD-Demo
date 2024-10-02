"use client";
import React, { useState } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";

export default function Home() {
  const [celebrity, setCelebrity] = useState("");
  const [environment, setEnvironment] = useState("");
  const [scenario, setScenario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flags = useFlags();
  const ldClient = useLDClient();
  
  const generateScenario = async () => {
    setIsLoading(true);
    try {
      const user = {
        key: 'user-key-123',
        custom: {
          celebrity: celebrity,
          environment: environment
        }
      };
      await ldClient?.identify(user);
  
      console.log("Sending request with:", { celebrity, environment });
  
      const response = await fetch("/api/generate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ celebrity, environment, promptConfig: flags.aiPromptConfig }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Received response:", data);
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      setScenario(data.scenario);
    } catch (error) {
      console.error("Failed to generate scenario:", error);
      setScenario("Failed to generate scenario. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }


  const celebrities = [
    "Nicolas Cage", "Bad Bunny", "King Charles", "Justin Bieber", "Lady Gaga", "Snoop Dogg", "Martha Stewart", "Kanye West",
    "Betty White", "Gordon Ramsay", "Beyoncé", "Jeff Goldblum", "Dolly Parton",
    "Bill Nye the Science Guy", "Flavor Flav", "The Rock's Eyebrow", "Chuck Norris", "Weird Al Yankovic"
  ];

  const environments = [
    "Inside a Giant Burrito", "Biork Hive Mind", "just Twitter", "The White House", "Underwater Disco", "Haunted IKEA", "Jurassic Park Gift Shop",
    "Sentient Cloud City", "Chocolate Factory Gone Wrong", "Upside-Down Skyscraper",
    "Abandoned Theme Park on Mars", "Inside a Giant's Pocket", "Miniature Golf Course Jungle",
    "Intergalactic Space Truck Stop", "Zombie-Infested Shopping Mall",
    "Enchanted Forest of Talking Furniture", "Post-Apocalyptic Ball Pit",
    "Dimension Where Everything is Made of Cheese"
  ];

 
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white text-gray-800">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-gray-900">Celebrity Wilderness Challenge Simulator</h1>
        <div className="flex flex-col gap-4">
          <select 
            value={celebrity}
            onChange={(e) => setCelebrity(e.target.value)}
            className="p-2 border rounded"
            aria-label="Select celebrity"
            disabled={isLoading}
          >
            <option value="">Select a celebrity</option>
            {celebrities.map((celeb) => (
              <option key={celeb} value={celeb}>{celeb}</option>
            ))}
          </select>
          <select 
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="p-2 border rounded"
            aria-label="Select environment"
            disabled={isLoading}
          >
            <option value="">Select an environment</option>
            {environments.map((env) => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
          <button 
            onClick={generateScenario}
            disabled={!celebrity || !environment || isLoading}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            {isLoading ? 'Generating...' : 'Generate Scenario'}
          </button>
        </div>
        {isLoading && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-gray-800">
            <p className="text-center">Generating your hilarious scenario...</p>
            <div className="loader mt-2"></div>
          </div>
        )}
        {!isLoading && scenario && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Survival Scenario:</h2>
            <p>{scenario}</p>
          </div>
        )}
      </main>
    </div>
  );
}