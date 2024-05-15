import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";
import { io } from "socket.io-client";

const socket = io('https://sheychat-udemy.onrender.com');
function Home() {
  const [searchKey, setSearchKey] = React.useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  useEffect(() => {
    // join the room
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("came-online", user._id);

      socket.on("online-users-updated", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user]);

  return (
    <div className="flex flex-col lg:flex-row gap-5">
    {/* 1st part: User search, users list/chat list */}
    <div className="w-full lg:w-1/3">
      <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
      <UsersList
        searchKey={searchKey}
        socket={socket}
        onlineUsers={onlineUsers}
      />
    </div>
  
    {/* 2nd part: Chat box */}
    {selectedChat ? (
      <div className="w-full lg:w-2/3">
        <ChatArea socket={socket} />
      </div>
    ) : (
      <div className="w-full h-[80vh] flex items-center justify-center flex-col bg-white">
        <img
          src="https://www.pngmart.com/files/16/Speech-Chat-Icon-Transparent-PNG.png"
          alt="Chat icon"
          className="w-48 h-48 lg:w-96 lg:h-96"
        />
        <h1 className="text-xl lg:text-2xl font-semibold text-gray-500">
          Select a user to chat
        </h1>
      </div>
    )}
  </div>
  
  );
}

export default Home;
