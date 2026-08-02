import React, { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../context/DataProvider";

function AudioVideoScreen() {
  const { roomId, peerInstance, status, socket, peerId } = useContext(DataContext);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const activeCallRef = useRef(null);
  const hasCalledRef = useRef(false);

  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const getLocalStream = async () => {
    if (localStreamRef.current) return localStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    if (currentUserVideoRef.current) {
      currentUserVideoRef.current.srcObject = stream;
    }
    return stream;
  };

  // Request the local camera as soon as this screen mounts, regardless of
  // host/interviewee role — otherwise your own preview stays blank until
  // someone else joins and triggers a call
  useEffect(() => {
    getLocalStream().catch((err) => {
      console.error("Failed to get local camera on mount:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attachRemoteStream = (remoteStream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    setConnectionStatus("connected");
  };

  const call = async (remotePeerId) => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;
    try {
      const stream = await getLocalStream();
      const mediaConnection = peerInstance.current.call(remotePeerId, stream);
      activeCallRef.current = mediaConnection;

      mediaConnection.on("stream", attachRemoteStream);
      mediaConnection.on("close", () => setConnectionStatus("left"));
      mediaConnection.on("error", (err) => {
        console.error("Call error:", err);
        setConnectionStatus("left");
      });
    } catch (err) {
      console.error("Failed to get local stream", err);
      setConnectionStatus("waiting");
    }
  };

  useEffect(() => {
    if (!socket || !peerInstance.current) return;

    socket.on("connect", () => console.log("connected", socket.id));

    socket.emit("joinRoom", roomId);

    if (status === "interviewer" && peerId) {
      socket.emit("register-peer", { roomId, peerId });
      console.log("Registered Host Peer:", peerId);
      setConnectionStatus("waiting");
    }

    peerInstance.current.off("call");
    peerInstance.current.on("call", async (incomingCall) => {
      try {
        const stream = await getLocalStream();
        incomingCall.answer(stream);
        activeCallRef.current = incomingCall;

        incomingCall.on("stream", attachRemoteStream);
        incomingCall.on("close", () => setConnectionStatus("left"));
      } catch (err) {
        console.error("Failed to get local stream", err);
      }
    });

    if (status === "interviewee") {
      socket.emit("request-peer", roomId);
    }

    socket.on("host-peer", (hostPeerId) => {
      console.log("Host Peer ID:", hostPeerId);
      if (hostPeerId) {
        call(hostPeerId);
      } else {
        setConnectionStatus("waiting");
      }
    });

    socket.on("user-left", () => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      setConnectionStatus("left");
      activeCallRef.current?.close();
      activeCallRef.current = null;
      hasCalledRef.current = false;
    });

    return () => {
      socket.off("connect");
      socket.off("host-peer");
      socket.off("user-left");
      peerInstance.current?.off("call");
    };
  }, [roomId, status, peerId, socket]);

  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      activeCallRef.current?.close();
      socket?.emit("leaveRoom", roomId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    }
  };

  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
    }
  };

  const statusMessage = {
    connecting: "Setting up your camera...",
    waiting: "Waiting for the other participant to join...",
    connected: null,
    left: "The other participant has left the call.",
  }[connectionStatus];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <h2 className="font-bold text-white">Video Call</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
          <video
            ref={currentUserVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-1 rounded-md text-xs font-medium text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            You
          </div>
        </div>

        <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {statusMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-900/90">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-sm font-medium text-gray-200 text-center px-4">
                {statusMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={toggleMic}
          className={`p-3 rounded-full transition-colors ${
            micOn ? "bg-gray-800 hover:bg-gray-700" : "bg-red-500 hover:bg-red-600"
          }`}
          aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          🎤
        </button>
        <button
          onClick={toggleCam}
          className={`p-3 rounded-full transition-colors ${
            camOn ? "bg-gray-800 hover:bg-gray-700" : "bg-red-500 hover:bg-red-600"
          }`}
          aria-label={camOn ? "Turn off camera" : "Turn on camera"}
        >
          📷
        </button>
      </div>
    </div>
  );
}

export default AudioVideoScreen;