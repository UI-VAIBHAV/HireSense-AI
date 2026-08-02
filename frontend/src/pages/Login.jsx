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
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-950 px-4">
      <div className="flex items-center gap-2 mb-10">
        <span className="text-2xl font-extrabold text-amber-400">HireSense</span>
        <span className="text-2xl font-extrabold text-white">AI</span>
      </div>

      <form
        onSubmit={handleLogin}
        className="flex flex-col bg-gray-900 border border-gray-800 rounded-2xl p-8 sm:p-10 w-full max-w-md gap-5 shadow-xl"
        noValidate
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-extrabold text-white">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Log in to continue your practice</p>
        </div>

        {error && (
          <div
            role="alert"
            className="w-full bg-red-950/40 border border-red-900 text-red-400 text-sm font-medium rounded-lg px-4 py-3"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="username" className="text-xs font-semibold text-gray-400">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="p-3 w-full bg-gray-800 border border-gray-700 text-white rounded-lg outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="password" className="text-xs font-semibold text-gray-400">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="p-3 w-full bg-gray-800 border border-gray-700 text-white rounded-lg outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-lg transition-colors mt-2"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400">
          New User?{" "}
          <Link className="text-amber-400 font-semibold hover:underline" to="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;