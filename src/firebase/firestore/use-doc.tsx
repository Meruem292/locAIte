'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  doc,
  type Firestore,
  type DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

type UseDocOptions = {
  idField?: string;
  refField?: string;
};

function useDoc<T>(
  ref: DocumentReference | null,
  options?: UseDocOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const docData = snapshot.data() as T;
          if (options?.idField) {
            (docData as any)[options.idField] = snapshot.id;
          }
          if (options?.refField) {
            (docData as any)[options.refField] = snapshot.ref;
          }
          setData(docData);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref, options?.idField, options?.refField]);

  return { data, loading, error };
}

export { useDoc };
