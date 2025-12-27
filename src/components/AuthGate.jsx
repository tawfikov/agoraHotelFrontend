import { useAuth } from '../context/AuthContext';
import PageLoader from './PageLoader';

export function AuthGate({ children, fallback = <PageLoader /> }) {
  const { authLoading } = useAuth(); // or `isReady` if your context exposes that
  if (authLoading) return fallback;
  return children;
}
