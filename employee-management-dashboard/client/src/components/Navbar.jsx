import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// Top navigation bar shown on authenticated pages. Displays the app title,
// the logged-in user, and a logout button.
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            E
          </div>
          <span className="text-base font-semibold text-gray-900 sm:text-lg">
            Employee Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:inline">
            {user?.name || user?.email}
          </span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
