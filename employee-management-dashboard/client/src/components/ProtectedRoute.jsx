import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './Spinner.jsx';

/**
 * Wraps private pages. Behavior:
 *  - While the initial token check runs -> show a spinner (no premature redirect).
 *  - If no authenticated user -> redirect to /login.
 *  - Otherwise -> render the protected children.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner fullScreen label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
