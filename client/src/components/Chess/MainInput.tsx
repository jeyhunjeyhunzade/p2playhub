//@ts-nocheck
import { useEffect, useRef, useState } from "react";
import swal from "sweetalert";

const MainInput = ({ setUsername, username, setUser, socket }) => {
  const [disable, setDisable] = useState(false);
  const buttonRef = useRef();
  useEffect(() => {
    // error handle on any type in server
    socket.on("connect_error", (err) => {
      if (err.message === "username exist") {
        swal({
          title: "Could not connect, Username already exists",
          icon: "error",
        });
      } else {
        swal({
          title: "Couldn't connect, please try again",
          icon: "error",
        });
      }
      setUsername("");
      setDisable(false);
      console.log(err.message, "so disconnected"); // prints the message associated with the error
      socket.disconnect();
    });
    // check if the socket is connect, then move to other page
    socket.on("connect", () => {
      console.log("iam connected");
      setUser(true);
    });
    return () => {
      socket.off("connect_error");
      socket.off("connect");
    };
  }, []);
  const join = (e) => {
    e.preventDefault();
    setDisable(true);
    if (username === "") {
      swal({ text: "Enter some text please!", icon: "error" });
      setDisable(false);
      return;
    }
    socket.auth = { username };
    socket.connect();
  };
  return (
    <div className="MainInput__container">
      <form onSubmit={join}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="enter username"
          required
        />
        <button
          ref={buttonRef}
          onClick={join}
          style={{ backgroundColor: disable ? "lightgrey" : "#27ae60" }}
          disabled={disable}
        >
          JOIN &#x2771;
        </button>
      </form>
    </div>
  );
};

export default MainInput;
