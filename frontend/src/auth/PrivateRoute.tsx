import { useEffect, useState } from 'preact/hooks';
import { type FunctionalComponent } from "preact";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../hooks/initializeFirebase';
import { route } from 'preact-router';

const PrivateRoute: FunctionalComponent = ({ children }: { children?: preact.ComponentChildren }) => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(!auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) route('/signin', true);
    });
    return unsubscribe;
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return null; // route() will redirect

  return children;
}

export default PrivateRoute;