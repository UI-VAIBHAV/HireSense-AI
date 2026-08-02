import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../context/DataProvider";
import { FaCopy, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PopupModal() {
  const { setStatus, peerId, roomId, setRoomId } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && peerId) {
      setRoomId(peerId);
    }
  }, [isOpen, peerId, setRoomId]);

  const openModal = () => {
    setStatus("interviewer");
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);
  const closeModalAndJoin = () => {
    setIsOpen(false);
    navigate("/room");
  };

  const handleCopy = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <button
        className="bg-blue-400 hover:bg-blue-500 font-semibold text-lg text-white px-4 py-1 rounded-md shadow-md transition-colors"
        onClick={openModal}
      >
        Start an Interview
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Room ID</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-xl"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xl sm:text-2xl font-semibold text-gray-500 break-all">
                {roomId.length ? roomId : "Loading..."}
              </p>
              <button
                onClick={handleCopy}
                disabled={!roomId}
                className="flex-shrink-0 text-gray-500 hover:text-gray-800 disabled:opacity-40 transition-colors"
                aria-label="Copy room ID"
                title={copied ? "Copied!" : "Copy room ID"}
              >
                {copied ? (
                  <FaCheck className="text-2xl text-green-600" />
                ) : (
                  <FaCopy className="text-2xl" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Share this ID with the person you're interviewing — they'll
              enter it to join.
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-md shadow-xl mr-2 transition-colors"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-xl transition-colors disabled:opacity-50"
                onClick={closeModalAndJoin}
                disabled={!roomId}
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopupModal;