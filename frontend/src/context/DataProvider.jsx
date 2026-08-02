import Peer from "peerjs";
import React, {
  useState,
  createContext,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";

export const DataContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until we know real login state
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("");
  const [roomId, setRoomId] = useState("");
  const [peerId, setPeerId] = useState("");
  const peerInstance = useRef(null);

  // Check real login state via the httpOnly cookie, not localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const newSocket = io(API_URL, { withCredentials: true });
    setSocket(newSocket);

    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    peerInstance.current = peer;

    // Clean up on unmount so we don't leak connections
    return () => {
      newSocket.disconnect();
      peer.destroy();
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        status,
        setStatus,
        roomId,
        setRoomId,
        peerInstance,
        peerId,
        socket,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};