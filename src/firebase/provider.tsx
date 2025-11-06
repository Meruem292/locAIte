'use client';

import {
  useContext,
  createContext,
  type ReactNode,
  useMemo,
  memo,
} from 'react';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { useUser } from '@/firebase/auth/use-user';

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

type FirebaseProviderProps = {
  children: ReactNode;
  value: FirebaseContextValue;
};

const FirebaseProvider = memo(function FirebaseProvider({
  children,
  value,
}: FirebaseProviderProps) {
  const { auth, firestore, app } = value;

  const contextValue = useMemo(
    () => ({
      app,
      auth,
      firestore,
    }),
    [app, auth, firestore]
  );

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
});

function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

function useFirebaseApp() {
  const { app } = useFirebase();
  return app;
}

function useAuth() {
  const { auth } = useFirebase();
  const user = useUser(auth);

  return useMemo(() => ({ auth, user }), [auth, user]);
}

function useFirestore() {
  const { firestore } = useFirebase();
  return firestore;
}

export {
  FirebaseProvider,
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
};
