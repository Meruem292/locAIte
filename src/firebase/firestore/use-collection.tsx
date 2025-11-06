'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  type Firestore,
  type Query,
  type DocumentData,
  type CollectionReference,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';

type UseCollectionOptions = {
  idField?: string;
  refField?: string;
};

function useCollection<T>(
  q: Query | CollectionReference | null,
  options?: UseCollectionOptions
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!q) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => {
          const docData = doc.data() as T;
          if (options?.idField) {
            (docData as any)[options.idField] = doc.id;
          }
          if (options?.refField) {
            (docData as any)[options.refField] = doc.ref;
          }
          return docData;
        });
        setData(docs);
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
  }, [q, options?.idField, options?.refField]);

  return { data, loading, error };
}

export { useCollection };
