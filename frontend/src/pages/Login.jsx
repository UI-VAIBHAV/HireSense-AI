import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataProvider";

function Login() {
  const { setUser } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        navigate("/");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4">
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white">Welcome Back</h1>
        <p className="text-gray-400 mt-3">
          Sign in to continue to your account
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleLogin}
        noValidate
        className="backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-8 space-y-6"
      >
        {error && (
          <div
            role="alert"
            className="bg-red-500/15 border border-red-500 text-red-300 rounded-lg px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}

        {/* Username */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Username
          </label>

          <input
            id="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full rounded-xl bg-gray-900/70 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl bg-gray-900/70 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-700"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="h-px flex-1 bg-gray-700"></div>
        </div>

        {/* Signup */}
        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}

export default Login;