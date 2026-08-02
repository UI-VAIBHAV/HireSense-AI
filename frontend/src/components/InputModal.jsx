import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataProvider";
import { useNavigate } from "react-router-dom";

function InputModal() {
  const { setStatus, setRoomId } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setInputValue("");
    setError("");
  };

  const closeModalAndJoin = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Please enter a room ID.");
      return;
    }
    setRoomId(trimmed);
    setStatus("interviewee");
    setIsOpen(false);
    navigate("/room");
  };

  return (
    <div>
      <button
        className="font-semibold text-lg px-4 py-1 rounded-md border border-gray-300 shadow-md hover:bg-gray-50 transition-colors"
        onClick={openModal}
      >
        Join an Interview
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Enter Room ID</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-xl"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="mb-1">
              <input
                type="text"
                className="border border-gray-400 px-4 py-2 w-full rounded-xl outline-none font-semibold focus:border-blue-400 transition-colors"
                placeholder="Room ID"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && closeModalAndJoin()}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm font-medium mb-3">{error}</p>
            )}
            <div className="flex justify-end mt-3">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-xl transition-colors"
                onClick={closeModalAndJoin}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InputModal;