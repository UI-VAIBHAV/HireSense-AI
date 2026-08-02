import { useContext, useState } from "react";
import { DataContext } from "../context/DataProvider";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const { setUser } = useContext(DataContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !username.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        navigate("/");
      } else {
        setError(data.message || "Signup failed. Please try again.");
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
        <h1 className="text-5xl font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-3">
          Join us and get started today
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSignup}
        noValidate
        className="backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl rounded-2xl p-8 space-y-5"
      >
        {error && (
          <div
            role="alert"
            className="bg-red-500/15 border border-red-500 text-red-300 rounded-lg px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-xl bg-gray-900/70 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-xl bg-gray-900/70 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
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
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-xl bg-gray-900/70 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-700"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="h-px flex-1 bg-gray-700"></div>
        </div>

        {/* Login */}
        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}

export default Signup;