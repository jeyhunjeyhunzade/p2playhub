import { useState } from "react";
import { io } from "socket.io-client";

import MainInput from "@app/components/Chess/MainInput";
import Userlist from "@app/components/Chess/Userlist";
import "@app/components/Chess/style.css";

const socket = io("http://localhost:8000", { autoConnect: false });

function Chess() {
  const [user, setUser] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <div className="bg-[url('/board.jpeg')]">
      {user ? (
        <Userlist socket={socket} username={username} />
      ) : (
        <MainInput
          setUser={setUser}
          setUsername={setUsername}
          username={username}
          socket={socket}
        />
      )}
    </div>
  );
}

export default Chess;
