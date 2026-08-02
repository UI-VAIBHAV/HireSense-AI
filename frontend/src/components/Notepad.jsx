import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Notepad({ socket, roomId }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handleReceiveText = (data) => setValue(data);
    socket.on("recieve-text", handleReceiveText);

    return () => {
      // Only unsubscribe from this event — never leave the shared room here.
      // Room lifecycle (join/leave) is owned by AudioVideoScreen/MainPage.
      socket.off("recieve-text", handleReceiveText);
    };
  }, [socket]);

  const handleChange = (newValue) => {
    setValue(newValue);
    socket?.emit("text-change", { room: roomId, data: newValue });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        <h2 className="text-lg font-bold text-white">Notes</h2>
      </div>
      <div className="rounded-lg overflow-hidden">
        <ReactQuill theme="snow" value={value} onChange={handleChange} className="h-64" />
      </div>
    </div>
  );
}

export default Notepad;