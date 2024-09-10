"use client";
import { useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import Image from "next/image";

export default function Home() {
  // State variables for user inputs and generated scenario
  const [celebrity, setCelebrity] = useState("");
  const [environment, setEnvironment] = useState("");
  const [scenario, setScenario] = useState("");
  const [userRole, setUserRole] = useState("Couch Potato");

  // Use LaunchDarkly feature flags
  const { enabledCelebrities, enabledEnvironments } = useFlags();

  // Function to generate scenario
  const generateScenario = async () => {
    const response = await fetch("/api/generate-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ celebrity, environment, userRole }),
    });
    if (response.status === 429) {
      setScenario("Rate limit exceeded. Please try again later.");
    } else {
      const data = await response.json();
      setScenario(data.scenario);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Celebrity Wilderness Challenge Simulator</h1>
        <div className="flex flex-col gap-4">
          {/* Celebrity selection dropdown using LaunchDarkly feature flag */}
          <select 
            onChange={(e) => setCelebrity(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select a celebrity</option>
            {enabledCelebrities?.map((celeb: string) => (
              <option key={celeb} value={celeb}>{celeb}</option>
            ))}
          </select>
          {/* Environment selection dropdown using LaunchDarkly feature flag */}
          <select 
            onChange={(e) => setEnvironment(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select an environment</option>
            {enabledEnvironments?.map((env: string) => (
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
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Generate Scenario
          </button>
        </div>
        {/* Display generated scenario */}
        {scenario && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold mb-2">Survival Scenario:</h2>
            <p>{scenario}</p>
          </div>
        )}
      </main>
    </div>
  );
}
