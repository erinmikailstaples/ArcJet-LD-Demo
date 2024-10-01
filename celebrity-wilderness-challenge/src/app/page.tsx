"use client";
import { useState } from "react";

export default function Home() {
  const [celebrity, setCelebrity] = useState("");
  const [environment, setEnvironment] = useState("");
  const [scenario, setScenario] = useState("");

  const generateScenario = async () => {
    const response = await fetch("/api/generate-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ celebrity, environment }),
    });
    const data = await response.json();
    setScenario(data.scenario);
  };

  const celebrities = [
    "Nicolas Cage", "Bad Bunny", "King Charles", "Justin Bieber", "Lady Gaga", "Snoop Dogg", "Martha Stewart", "Kanye West",
    "Betty White", "Gordon Ramsay", "Beyoncé", "Jeff Goldblum", "Dolly Parton",
    "Bill Nye the Science Guy", "Flavor Flav", "The Rock's Eyebrow", "Chuck Norris", "Weird Al Yankovic"
  ];

  const environments = [
    "Inside a Giant Burrito", "Biork Hive Mind", "just Twitter", "The White House", "OnlyFans", "Underwater Disco", "Haunted IKEA", "Jurassic Park Gift Shop",
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
            onChange={(e) => setCelebrity(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select a celebrity</option>
            {celebrities.map((celeb) => (
              <option key={celeb} value={celeb}>{celeb}</option>
            ))}
          </select>
          <select 
            onChange={(e) => setEnvironment(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select an environment</option>
            {environments.map((env) => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
          <button 
            onClick={generateScenario}
            disabled={!celebrity || !environment}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Generate Scenario
          </button>
        </div>
        {scenario && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Survival Scenario:</h2>
            <p>{scenario}</p>
          </div>
        )}
      </main>
    </div>
  );
}