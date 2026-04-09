import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-blue-600 text-white">
      
      <Link to="/" className="text-xl font-bold">
        Eventify
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-blue-200">Home</Link>

        {user && (
          <Link to="/dashboard" className="hover:text-blue-200">
            Dashboard
          </Link>
        )}

        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-200">Login</Link>
            <Link to="/register" className="hover:text-blue-200">Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;