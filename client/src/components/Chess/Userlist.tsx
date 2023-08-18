//@ts-nocheck
import { useState, useEffect, useContext } from "react";
import MainChess from "./MainChess";
import swal from "sweetalert";

import { socket } from "@app/api/socket";
import { AppContext } from "@app/pages/App";
import { AppContextShape } from "@app/types/types";

const Userlist = () => {
  const [start, setStart] = useState(false);
  const [users, setUsers] = useState([]);
  const [oppenent, setOppenent] = useState();
  const { userName } = useContext(AppContext) as AppContextShape;

  useEffect(() => {
    socket.emit("getList", "get");
  }, []);

  useEffect(() => {
    socket.on("list", (res) => {
      const user = [];
      for (var key of Object.keys(res)) {
        if (key !== socket.id) {
          let data = {
            id: key,
            username: res[key].username,
          };
          user.push(data);
        }
      }
      setUsers(user);
    });
    return () => {
      socket.off("list");
    };
  }, []);

  useEffect(() => {
    socket.on("create", ({ gameid, id, username }) => {
      swal({
        title: `You are being challenge by ${username}`,
        icon: "warning",
        button: "join",
      }).then((isConfirmed) => {
        if (isConfirmed) {
          let myid = socket.id;
          socket.emit("join", { gameid, id, myid });
          setStart(true);
        }
      });
    });
    return () => {
      socket.off("create");
    };
  }, []);

  useEffect(() => {
    users &&
      users.map((user) => {
        setOppenent(user);
      });
  }, [users]);

  const startGame = (id) => {
    socket.emit("create", id);
    setStart(true);
  };

  return (
    <div className="flex h-[100vh] h-[100vh] flex-col items-center justify-center">
      {!start ? (
        <div className="flex h-[100vh] flex-col items-center justify-center">
          <div className="flex flex-col">
            <div className="username-box flex h-[84px] w-[440px] items-center justify-center">
              You - {userName}
            </div>
            <div className="custom-vs my-4">VS</div>
            <div className="username-box flex h-[84px] w-[440px] items-center justify-center">
              Opponent - {oppenent?.username}
            </div>
          </div>
          <div className="mt-10">
            {oppenent && (
              <button
                className="custom-button custom-button-green ml-2"
                onClick={() => startGame(oppenent.id)}
              >
                Play
              </button>
            )}
          </div>
          {/* <ul>
            <li className="first">Your username</li>
            <li>{userName} &#x2654;</li>
            <li className="second">Other players</li>
            {users &&
              users.map((value, index) => (
                <li key={index}>
                  {value.username}{" "}
                  {
                    <button
                      style={{ borderRadius: "20px" }}
                      onClick={() => startGame(value.id)}
                    >
                      play&#x2654;
                    </button>
                  }
                </li>
              ))}
          </ul> */}
        </div>
      ) : (
        <MainChess username={userName} socket={socket} />
      )}
    </div>
  );
};

export default Userlist;
