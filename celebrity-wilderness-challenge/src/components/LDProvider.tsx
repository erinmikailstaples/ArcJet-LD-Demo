'use client'

import { withLDProvider } from 'launchdarkly-react-client-sdk';

function LDProvider({ children }) {
  return <>{children}</>;
}

export default withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID!,
  options: {
    bootstrap: 'localStorage',
  },
})(LDProvider);
