import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataProvider";
import heroGif from "../assets/job-interview.gif";
import textEditorImg from "../assets/Text Editor.png";
import codeEditorImg from "../assets/code editor.png";
import { useNavigate } from "react-router-dom";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import InputModal from "../components/InputModal";
import PopupModal from "../components/PopupModal";

const API_URL = import.meta.env.VITE_API_URL;

function Homepage() {
  const { setUser, user } = useContext(DataContext);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) console.error("Logout request failed");
      setUser(null);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoggingOut(false);
    }
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <div className="flex flex-wrap gap-4 px-6 py-4 justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-amber-400">HireSense</span>
          <span className="text-2xl font-extrabold text-white">AI</span>
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <button onClick={() => navigate("/")} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Home
          </button>
          <button onClick={scrollToFeatures} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Features
          </button>
          {user ? (
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm font-semibold bg-gray-800 hover:bg-gray-700 border border-gray-700 disabled:opacity-60 rounded-lg py-2 px-4 transition-colors"
            >
              {loggingOut ? "Logging out..." : "Log Out"}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg py-2 px-4 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-sm font-semibold bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 px-4 transition-colors"
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold text-gray-300">AI-powered mock interviews</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
          Ace Your Interviews<br />
          <span className="text-amber-400">with Confidence</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-xl">
          Practice with real-time video, a collaborative code editor, and AI-powered feedback — all in one room.
        </p>

        {user ? (
          <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-amber-500/50 transition-colors">
              <h3 className="font-bold text-lg mb-1">Host Session</h3>
              <p className="text-sm text-gray-400 mb-5">Instantly generate a room and start an interview session.</p>
              <PopupModal />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-amber-500/50 transition-colors">
              <h3 className="font-bold text-lg mb-1">Join Session</h3>
              <p className="text-sm text-gray-400 mb-5">Enter a room code shared by your peer.</p>
              <InputModal />
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-gray-900 hover:bg-gray-800 border border-gray-700 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Signup
            </button>
          </div>
        )}

        <img src={heroGif} alt="Person practicing a mock interview" className="w-full max-w-xs mt-16 rounded-2xl opacity-90" />
      </div>

      {/* Features */}
      <div id="features" className="px-6 py-20 max-w-5xl mx-auto scroll-mt-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16">
          Our <span className="text-amber-400">Features</span>
        </h2>

        <div className="flex flex-col gap-16">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <p className="text-lg text-gray-300 md:w-1/2">
              <strong className="text-white">Audio and Video Calls: </strong>
              Communicate seamlessly with crystal-clear audio and video.
            </p>
            <img
              src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*NLSe2SyjfxdbEqFsOWHhlg.png"
              className="w-full max-w-xs md:w-4/12 rounded-2xl border border-gray-800"
              alt="Two people on a video call interview"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-lg text-gray-300 md:w-1/2">
              <strong className="text-white">Collaborative Code Editor: </strong>
              Code together in real-time with syntax highlighting and autocompletion.
            </p>
            <img src={codeEditorImg} className="w-full max-w-xs md:w-4/12 rounded-2xl border border-gray-800" alt="Collaborative code editor interface" />
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <p className="text-lg text-gray-300 md:w-1/2">
              <strong className="text-white">Text Editor: </strong>
              Take notes and plan your solutions with our integrated text editor.
            </p>
            <img src={textEditorImg} className="w-full max-w-xs md:w-4/12 rounded-2xl border border-gray-800" alt="Integrated note-taking text editor" />
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-6 py-20 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-16">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { n: "1", t: "Sign Up", d: "Create an account to get started." },
            { n: "2", t: "Create or Join", d: "Start or join an interview session." },
            { n: "3", t: "Practice", d: "Use our tools to sharpen your interview skills." },
          ].map((step) => (
            <div key={step.n} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-gray-900 font-bold flex items-center justify-center mx-auto mb-4">
                {step.n}
              </div>
              <h3 className="font-bold mb-2">{step.t}</h3>
              <p className="text-sm text-gray-400">{step.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-6 py-16">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10">
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4 text-2xl text-gray-400">
              <a href="https://www.linkedin.com/in/vaibhav-pandey-2473452a6/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors" aria-label="X (Twitter)">
                <FaSquareXTwitter />
              </a>
              <a href="https://github.com/UI-VAIBHAV" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors" aria-label="GitHub">
                <FaSquareGithub />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <p className="text-sm text-gray-400">Email: info@HireSense-AI.com</p>
            <p className="text-sm text-gray-400">Phone: +123 456 7890</p>
            <p className="text-sm text-gray-400">Address: 123 Main Street, City, Country</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-12">
          &copy; {new Date().getFullYear()} HireSense-AI. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Homepage;