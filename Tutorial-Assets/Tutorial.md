# How this was built

### Setting up your project

Set up the Next.js project: Run the following command to create a new Next.js project:

```npx create-next-app@latest celebrity-wilderness-challenge```

Choose the default options when prompted.

![alt text](image.png)

Navigate to the project directory:

```cd celebrity-wilderness-challenge```

Install necessary dependencies

```npm install launchdarkly-react-client-sdk @arcjet/next replicate```

Set up your environment variables.  Start by creating an **.env.local** file in the root of your project and add the following:

```
REPLICATE_API_TOKEN=your_replicate_api_token
LAUNCHDARKLY_CLIENT_SIDE_ID=your_launchdarkly_client_side_id
ARCJET_API_KEY=your_arcjet_api_key
```

#### Configure ArcJet

Create a new file **app/api/arcjet.js:**

within it, add the following:

``` 
import { ArcjetNext } from "@arcjet/next";

export const arcjet = new ArcjetNext({
  apiKey: process.env.ARCJET_API_KEY,
});
```

#### Configure LaunchDarkly

Wrap your app with the LaunchDarkly provider within the **app/layout.js** file:

```
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";

const LDProvider = await asyncWithLDProvider({
  clientSideID: process.env.LAUNCHDARKLY_CLIENT_SIDE_ID,
  options: {
    bootstrap: "localStorage",
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <LDProvider>
        <body>{children}</body>
      </LDProvider>
    </html>
  );
}
```

Now, create the main page of the application.  Replace the content of app/page.js with:

```
"use client";
import { useState } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";

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
    <main>
      <h1>Celebrity Wilderness Challenge Simulator</h1>
      <select onChange={(e) => setCelebrity(e.target.value)}>
        {enabledCelebrities.map((celeb) => (
          <option key={celeb} value={celeb}>{celeb}</option>
        ))}
      </select>
      <select onChange={(e) => setEnvironment(e.target.value)}>
        {enabledEnvironments.map((env) => (
          <option key={env} value={env}>{env}</option>
        ))}
      </select>
      <button onClick={generateScenario}>Generate Scenario</button>
      {scenario && <p>{scenario}</p>}
    </main>
  );
}
```

### Create the API Route

From within the project directory, create a new file **app/api/generate-scenario/route.js**:

```
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
```

#### What we've done so far
This setup provides a basic structure for our Celebrity Wilderness Challenge Simulator. It uses LaunchDarkly to manage feature flags for enabled celebrities and environments, ArcJet for rate limiting the API route, and Replicate to generate scenarios using an AI model.

