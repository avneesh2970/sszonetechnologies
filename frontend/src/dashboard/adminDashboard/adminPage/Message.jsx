import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { BsPlus } from "react-icons/bs";
import { Link } from "react-feather";
import React from "react";
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

export default function AdminMessage() {
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className=" flex">
    
    <main className="flex  md:flex-row w-full h-screen">
    <div className="md:flex flex-col w-full md:w-1/2  border-r p-4 overflow-y-auto hidden ">
      <h2 className="text-lg font-semibold mb-3">Messages</h2>
      <input
        type="text"
        placeholder="Search Messages"
        className="w-full p-2 border rounded-md mb-3"
      />
      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
              selectedMessage.id === msg.id
                ? "bg-indigo-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedMessage(msg)}
          >
            <img
              src={msg.profile}
              alt={msg.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col flex-1">
              <p className="font-semibold truncate">{msg.name}</p>
              <p className="text-sm text-gray-600 truncate w-full">{msg.message}</p>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col w-full md:w-1/2 max-w-full px-6 md:py-6  py-2 overflow-y-auto">
    <button
        onClick={() => setIsOpen(true)}
        className=" pb-2 justify-end flex md:hidden "
      >
        Open
      </button>
      <div  className={`fixed top-0 left-0 h-full  bg-gray-800 text-white bg-opacity-50 transition-all duration-500 ease-in-out ${
          isOpen ? "w-xsm" : "w-0"
        } overflow-hidden`} 
      >
         <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-4 text-white "
        >
          ✖
        </button>
      <h2 className="text-lg font-semibold mb-3 pt-2">Messages</h2>
      <input
        type="text"
        placeholder="Search Messages"
        className="w-full p-2 border rounded-md mb-3"
      />
      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
              selectedMessage.id === msg.id
                ? "bg-indigo-100"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedMessage(msg)}
          >
            <img
              src={msg.profile}
              alt={msg.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col flex-1">
              <p className="font-semibold truncate">{msg.name}</p>
              <p className="text-sm text-gray-600 truncate w-full">{msg.message}</p>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

      <div className="flex justify-between items-center border-b pb-4 mb-4 ">
        <div className="flex items-center gap-3">
          <img
            src={selectedMessage.profile}
            alt={selectedMessage.name}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{selectedMessage.name}</p>
            <p className="text-sm text-gray-500">Designer Candidate</p>
          </div>
        </div>
        <div >
        <button className="bg-indigo-600 text-white p-2 px-4 rounded-md">View profile</button>
        </div>
       
       
      </div>
  
      <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-4">
        <div className="flex items-start gap-3">
          <img
            src={selectedMessage.profile}
            alt=""
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          />
          <div className="bg-white p-3 rounded-lg max-w-xs md:max-w-md">
            <p className="text-gray-700">Thank you! I'd love to join.</p>
          </div>
        </div>
        <div className="flex items-end gap-3 self-end">
          <div className="bg-indigo-500 text-white p-3 rounded-lg max-w-xs md:max-w-md">
            <p>Great! Welcome aboard.</p>
          </div>
          <img
            src={selectedMessage.profile}
            alt=""
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          />
        </div>
      </div>
  
      <div className="flex items-center gap-2  p-4 mt-auto">
        <input
          type="text"
          placeholder="Reply message"
          className="w-full p-2 border rounded-md"
          
        />
        
        <button className="bg-indigo-600 text-white p-2 px-4 rounded-md">Send</button>
      </div>
    </div>
  </main>
  </div>
  
  
   
  );
}