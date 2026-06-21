import React from "react";
import AudioVideoScreen from "../components/AudioVideoScreen";
import AIInterview from "../components/AIInterview";
import ResumeAnalyzer from "../components/ResumeAnalyzer";
function MainPage() {
  return (
    <div className="flex h-screen w-screen bg-gray-800">
      <div className="w-2/3">
        <AudioVideoScreen />
      </div>

      <div className="w-1/3 overflow-y-auto bg-white p-4">
        <AIInterview />
        <ResumeAnalyzer />
      </div>
    </div>
    
  );
}

export default MainPage;
