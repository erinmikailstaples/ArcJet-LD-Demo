"use client";
import { useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
import Image from "next/image";

export default function Home() {
  const [celebrity, setCelebrity] = useState("");
  const [environment, setEnvironment] = useState("");
  const [scenario, setScenario] = useState("");
  const { enabledCelebrities, enabledEnvironments } = useFlags();

  const generateScenario = async () => {
    const response = await fetch("/api/generate-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ celebrity, environment }),
    });
    const data = await response.json();
    setScenario(data.scenario);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Celebrity Wilderness Challenge Simulator</h1>
        <div className="flex flex-col gap-4">
          <select 
            onChange={(e) => setCelebrity(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select a celebrity</option>
            {enabledCelebrities?.map((celeb: string) => (
              <option key={celeb} value={celeb}>{celeb}</option>
            ))}
          </select>
          <select 
            onChange={(e) => setEnvironment(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select an environment</option>
            {enabledEnvironments?.map((env: string) => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
          <button 
            onClick={generateScenario}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate Scenario
          </button>
        </div>
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
