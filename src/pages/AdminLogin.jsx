import { adminLogin } from "../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await adminLogin({ username, password });
      if (data?.token) {
        setAuthToken(data.token);
        if (data.admin?.username) localStorage.setItem('admin_user', data.admin.username);
        navigate("/admin/dashboard");
      } else {
        throw new Error("No token returned");
      }
    } catch (err) {
      console.error('Admin login error:', err);
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4 py-12">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600">Sign in to manage suggestions</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                👤 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:shadow-md transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                🔒 Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:shadow-md transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Signing in...
                </span>
              ) : (
                "🔐 Sign In"
              )}
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">💡 Demo Credentials:</span><br/>
              Username: admin<br/>
              Password: password123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Only authorized admins can access this area
        </p>
      </div>
    </div>
  );
}
