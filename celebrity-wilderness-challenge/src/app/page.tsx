"use client";
import { useState, useEffect } from "react";
import { initialize, LDClient } from 'launchdarkly-js-client-sdk';

export default function Home() {
  // State variables for the application
  const [celebrity, setCelebrity] = useState("");
  const [environment, setEnvironment] = useState("");
  const [scenario, setScenario] = useState("");
  const [userRole, setUserRole] = useState("Couch Potato");
  const [ldClient, setLdClient] = useState<LDClient | null>(null);
  const [scenarioPrompt, setScenarioPrompt] = useState("");

  // Lists of celebrities and environments
  const celebrities = [
    "Nicolas Cage", "Lady Gaga", "Snoop Dogg", "Martha Stewart", "Kanye West",
    "Betty White", "Gordon Ramsay", "Beyoncé", "Jeff Goldblum", "Dolly Parton",
    "Bill Nye the Science Guy", "Flavor Flav", "The Rock's Eyebrow", "Chuck Norris", "Weird Al Yankovic"
  ];

  const environments = [
    "Inside a Giant Burrito", "Underwater Disco", "Haunted IKEA", "Jurassic Park Gift Shop",
    "Sentient Cloud City", "Chocolate Factory Gone Wrong", "Upside-Down Skyscraper",
    "Abandoned Theme Park on Mars", "Inside a Giant's Pocket", "Miniature Golf Course Jungle",
    "Intergalactic Space Truck Stop", "Zombie-Infested Shopping Mall",
    "Enchanted Forest of Talking Furniture", "Post-Apocalyptic Ball Pit",
    "Dimension Where Everything is Made of Cheese"
  ];

  // Initialize LaunchDarkly client
  useEffect(() => {
    const initLDClient = async () => {
      // Create a new LaunchDarkly client with the correct environment variable
      const client = initialize(process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID!, { key: 'anonymous' });
      // Wait for the client to initialize
      await client.waitForInitialization();
      // Set the client in state
      setLdClient(client);
      // Update the scenario prompt using the client
      updateScenarioPrompt(client);
    };

    initLDClient();

    // Cleanup function to close the LaunchDarkly client when the component unmounts
    return () => {
      ldClient?.close();
    };
  }, []);

  // Function to update the scenario prompt using LaunchDarkly
  const updateScenarioPrompt = (client: LDClient) => {
    // Use LaunchDarkly's AI model prompt flag
    const prompt = client.variation('ai-model-prompt', {
      prompt: 'Generate a survival scenario in 500 characters or less for {celebrity} in {environment}.',
      parameters: {
        celebrity: '{celebrity}',
        environment: '{environment}'
      }
    });
    // Set the scenario prompt in state
    setScenarioPrompt(prompt.prompt);
  };

  // Function to generate a scenario
  const generateScenario = async () => {
    const response = await fetch("/api/generate-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ celebrity, environment, userRole, scenarioPrompt }),
    });
    if (response.status === 429) {
      setScenario("Rate limit exceeded. Please try again later.");
    } else {
      const data = await response.json();
      setScenario(data.scenario);
    }
  };

  // Render the component
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white text-gray-800">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold text-gray-900">Celebrity Wilderness Challenge Simulator</h1>
        <div className="flex flex-col gap-4">
          {/* Celebrity selection dropdown */}
          <select 
            onChange={(e) => setCelebrity(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select a celebrity</option>
            {celebrities.map((celeb) => (
              <option key={celeb} value={celeb}>{celeb}</option>
            ))}
          </select>
          {/* Environment selection dropdown */}
          <select 
            onChange={(e) => setEnvironment(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select an environment</option>
            {environments.map((env) => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
          {/* User role selection dropdown */}
          <select 
            onChange={(e) => setUserRole(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Couch Potato">Couch Potato</option>
            <option value="Survivalist Fanatic">Survivalist Fanatic</option>
            <option value="Reality TV Producer">Reality TV Producer</option>
          </select>
          {/* Generate scenario button */}
          <button 
            onClick={generateScenario}
            disabled={!celebrity || !environment}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Generate Scenario
          </button>
        </div>
        {/* Display generated scenario */}
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
