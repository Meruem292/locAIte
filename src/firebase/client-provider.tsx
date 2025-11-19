'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebase = React.useMemo(initializeFirebase, []);

  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}

export { FirebaseClientProvider };
