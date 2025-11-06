'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';

function useUser(auth: Auth) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  return user;
}

export { useUser };
