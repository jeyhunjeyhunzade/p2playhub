//@ts-nocheck
import { useState, useEffect } from "react";
import MainChess from "./MainChess";
import swal from "sweetalert";
import "./style.css";

const Userlist = ({ socket, username }) => {
  const [start, setStart] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    socket.emit("getList", "get");
  }, []);
  useEffect(() => {
    // get the list of users connected to the socket except the current user
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

  const startGame = (id) => {
    socket.emit("create", id);
    setStart(true);
  };

  return (
    <>
      {!start ? (
        <div className="userlist">
          <ul>
            <li className="first">Your username</li>
            <li>{username} &#x2654;</li>
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
          </ul>
        </div>
      ) : (
        <MainChess username={username} socket={socket} />
      )}
    </>
  );
};

export default Userlist;
