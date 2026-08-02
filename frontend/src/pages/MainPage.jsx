import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AudioVideoScreen from "../components/AudioVideoScreen";
import CodeEditor from "../components/CodeEditor";
import Notepad from "../components/Notepad";
import AIInterview from "../components/AIInterview";
import ResumeAnalyzer from "../components/ResumeAnalyzer";
import { DataContext } from "../context/DataProvider";

const TABS = [
  { key: "notes", label: "Notes" },
  { key: "ai", label: "AI Mock Interview" },
  { key: "resume", label: "ATS Analyzer" },
];

function MainPage() {
  const { roomId, status, setRoomId, setStatus, socket } = useContext(DataContext);
  const [activeTab, setActiveTab] = useState("ai");
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId || !status) navigate("/");
  }, [roomId, status, navigate]);

  const handleLeave = () => {
    socket?.emit("leaveRoom", roomId);
    setRoomId("");
    setStatus("");
    navigate("/");
  };

  if (!roomId || !status) return null;

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Room: <span className="font-mono text-gray-100">{roomId}</span>
        </div>
        <button
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Leave Interview
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6 p-4 sm:p-6">
        <div className="flex flex-col gap-6 min-w-0">
          <AudioVideoScreen />
          <CodeEditor socket={socket} roomId={roomId} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-xs sm:text-sm font-semibold py-2 px-2 rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-amber-500 text-gray-900"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            {activeTab === "notes" && <Notepad socket={socket} roomId={roomId} />}
            {activeTab === "ai" && <AIInterview />}
            {activeTab === "resume" && <ResumeAnalyzer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;