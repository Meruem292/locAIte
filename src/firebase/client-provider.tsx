'use client';

import { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebase = useMemo(initializeFirebase, []);

  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}

export { FirebaseClientProvider };
