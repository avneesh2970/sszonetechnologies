import React, { useState, useEffect } from "react";

const messages = [
  {
    id: 1,
    name: "Jan Mayer",
    message: "We want to invite you for a qui...",
    time: "12 mins ago",
    profile: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Joe Bartmann",
    message: "Hey thanks for your interview...",
    time: "3:40 pm",
    profile: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Ally Wales",
    message: "Hey thanks for your interview...",
    time: "3:40 pm",
    profile: "https://i.pravatar.cc/150?img=3",
  },
];

export default function InstructorMessage() {
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile on mount and when resizing
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener("resize", checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleSend = () => {
    if (reply.trim()) {
      console.log(`Reply to ${selectedMessage.name}: ${reply}`);
      setReply("");
    }
  };

  const Sidebar = () => (
    <div 
      className={`${
        isMobile 
          ? `fixed top-0 left-0 h-full w-full sm:w-64 bg-white shadow-lg z-50 
             transition-all duration-300 ease-in-out 
             ${isOpen ? "translate-x-0" : "-translate-x-full"}`
          : "w-full md:w-1/3 lg:w-1/4 border-r"
      } flex flex-col p-4 overflow-y-auto`}
    >
      {isMobile && (
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-3 text-black text-xl"
        >
          ✖
        </button>
      )}
      <h2 className="text-lg font-semibold mb-3 pt-2">Messages</h2>
      <input
        type="text"
        placeholder="Search Messages"
        className="w-full p-2 border rounded-md mb-3"
      />
      <div className="flex flex-col gap-2 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
              selectedMessage.id === msg.id
                ? "bg-indigo-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setSelectedMessage(msg);
              if (isMobile) setIsOpen(false);
            }}
          >
            <img
              src={msg.profile}
              alt={msg.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <p className="font-semibold truncate">{msg.name}</p>
              <p className="text-sm text-gray-600 truncate">{msg.message}</p>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile unless opened */}
      {(!isMobile || isOpen) && <Sidebar />}

      {/* Main Chat Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header with Sidebar Toggle */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <h1 className="text-lg font-bold">Messages</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Messages
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 max-w-full overflow-hidden p-4">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedMessage.profile}
                alt={selectedMessage.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{selectedMessage.name}</p>
                <p className="text-sm text-gray-500">Designer Candidate</p>
              </div>
            </div>
            <button className="bg-indigo-600 text-white p-2 px-4 rounded-md text-sm">
              View profile
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-2 mb-4">
            <div className="flex items-start gap-3">
              <img
                src={selectedMessage.profile}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs sm:max-w-sm md:max-w-md">
                <p className="text-gray-700">Thank you! I'd love to join.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 self-end flex-row-reverse">
              <img
                src="https://i.pravatar.cc/150?img=8"
                alt="You"
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-indigo-500 text-white p-3 rounded-lg shadow-sm max-w-xs sm:max-w-sm md:max-w-md">
                <p>Great! Welcome aboard.</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-4 border-t bg-white sticky bottom-0">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply message"
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white p-2 px-4 rounded-md whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

