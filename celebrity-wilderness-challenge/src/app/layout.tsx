import { LDClient } from 'launchdarkly-js-client-sdk';

let ldClient;

export default function RootLayout({ children }) {
  if (typeof window !== 'undefined' && !ldClient) {
    ldClient = LDClient.initialize(process.env.LAUNCHDARKLY_CLIENT_SIDE_ID, { key: 'anonymous' });
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
