import React, { useEffect, useState } from "react";

function Output({ language, version, value, socket, roomId }) {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const handleRun = async () => {
    try {
      const reqBody = {
  code: value,
  language,
  input,
};

const API_URL = import.meta.env.VITE_API_URL;

const res = await fetch(
  `${API_URL}/api/compiler/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      const data = await res.json();
      console.log(data);
      const result =
  data.stdout ||
  data.stderr ||
  data.compile_output ||
  "No Output";

setOutput(result);

socket.emit("output-change", {
  room: roomId,
  data: result,
});
    } catch (error) {
      console.log(error);
    }
  };

  function handleChange(event) {
    const newValue = event.target.value;
    setInput(newValue);
    socket.emit("input-change", { room: roomId, data: newValue });
  }

  useEffect(() => {
    socket.on("recieve-input", (data) => {
      setInput(data);
    });

    socket.on("recieve-output", (data) => {
      setOutput(data);
    });

    return () => {
      socket.off("receive-input");
    };
  }, [socket]);

  return (
    <div className="flex flex-col w-full py-4">
      <div>
        <button
          className="text-lg font-semibold text-white bg-blue-500 rounded-xl shadow-xl px-4 py-1"
          onClick={handleRun}
        >
          Run
        </button>
      </div>
      <p className="text-lg font-semibold mt-3 text-white">Input</p>
      <textarea
        className="h-full w-full outline-none border-2 border-gray-500 rounded-lg shadow-xl text-semibold p-2"
        value={input}
        onChange={handleChange}
      />
      <p className="text-lg font-semibold mt-3 text-white">Output</p>
      <div className="h-full w-full border-2 border-gray-500 rounded-lg shadow-xl text-semibold bg-white p-2">
        {output}
      </div>
    </div>
  );
}

export default Output;
