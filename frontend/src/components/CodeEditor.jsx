import React, { useEffect, useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import LanguageDropdown from "./LanguageDropdown";
import Output from "./Output";

loader.config({ paths: { vs: "/vs" } });

function CodeEditor({ socket, roomId }) {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("c");
  const [version, setVersion] = useState("10.2.0");
  const [containerReady, setContainerReady] = useState(false);

  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  // Wait for the container to have a real, non-zero width before mounting
  // Monaco — sidesteps the flexbox first-paint measurement race
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width || 0;
      if (width > 50) {
        setContainerReady(true);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    editor.focus();
    editor.layout();
  }

  function handleEditorChange(newValue) {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      setValue(newValue);
      return;
    }
    setValue(newValue);
    socket?.emit("message", { room: roomId, data: newValue });
  }

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      isRemoteUpdate.current = true;
      setValue(data);
    };
    const handleReceiveLanguage = ({ language: lang, version: ver }) => {
      setLanguage(lang);
      setVersion(ver);
    };

    socket.on("recieve-message", handleReceiveMessage);
    socket.on("recieve-language", handleReceiveLanguage);

    return () => {
      socket.off("recieve-message", handleReceiveMessage);
      socket.off("recieve-language", handleReceiveLanguage);
    };
  }, [socket]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="font-bold text-white">Collaborative Code Editor</h2>
        </div>
        <LanguageDropdown
          langSetter={setLanguage}
          verSetter={setVersion}
          socket={socket}
          lang={language}
          ver={version}
          roomId={roomId}
        />
      </div>

      <div
        ref={containerRef}
        style={{ width: "100%", height: "50vh" }}
        className="rounded-xl overflow-hidden border border-gray-800"
      >
        {containerReady && (
          <Editor
            width="100%"
            height="100%"
            theme="vs-dark"
            language={language}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{ automaticLayout: true }}
          />
        )}
      </div>

      <Output
        version={version}
        language={language}
        value={value}
        socket={socket}
        roomId={roomId}
      />
    </div>
  );
}

export default CodeEditor;