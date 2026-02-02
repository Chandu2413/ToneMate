import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPalette, FaRobot } from "react-icons/fa";

export default function Navbar() {
  const loc = useLocation();
  const isHome = loc.pathname === "/";
  const [isAdmin, setIsAdmin] = React.useState(!!localStorage.getItem("admin_token"));
  const navigate = useNavigate();

  React.useEffect(() => {
    function onStorage() {
      setIsAdmin(!!localStorage.getItem("admin_token"));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    // lazy import to avoid circulars
    import("../services/api").then(({ clearAuthToken }) => {
      clearAuthToken();
      setIsAdmin(false);
      navigate("/admin/login");
    });
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-gradient-to-r from-tmindigo to-tmblue text-white">
            <FaPalette />
          </div>
          <div>
            <div className="font-bold text-lg">ToneMate</div>
            <div className="text-sm text-gray-500 -mt-1">AI Dress Recommender</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link to="/ai-recommender" className={`px-3 py-2 rounded hover:bg-gray-100 ${isHome ? "bg-gray-100" : ""}`}>AI Recommender</Link>
          <Link to="/color-match" className="px-3 py-2 rounded hover:bg-gray-100">Color Match</Link>
          <Link to="/color-mixer" className="px-3 py-2 rounded hover:bg-gray-100">Color Mixer</Link>
          <Link to="/stylist-chat" className="px-3 py-2 rounded hover:bg-gray-100">Stylist Chat</Link>
          <Link to="/suggestions" className="px-3 py-2 rounded hover:bg-gray-100">Suggestions</Link>
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">Hi, <span className="font-medium">{localStorage.getItem('admin_user') || 'Admin'}</span></div>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100">Logout</button>
            </div>
          ) : (
            <Link to="/admin/login" className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100"> Admin</Link>
          )}
        </nav>

        <div className="md:hidden">
          <button className="p-2 bg-white rounded shadow" aria-label="menu">
            <FaRobot />
          </button>
        </div>
      </div>
    </header>
  );
}
