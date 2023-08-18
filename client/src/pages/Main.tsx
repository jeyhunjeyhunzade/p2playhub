import BrandLogo from "@app/assets/p2pPlayHub copy.svg";
import { AppRoutes } from "@app/types/enums";
import swal from "sweetalert";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./App";
import { AppContextShape } from "@app/types/types";
import { socket } from "@app/api/socket";

const Main = () => {
  const navigate = useNavigate();
  const { userName, setUserName, setIsRoomActive } = useContext(
    AppContext
  ) as AppContextShape;

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
      setUserName("");
      console.log(err.message, "so disconnected");
      socket.disconnect();
    });
    socket.on("connect", () => {
      console.log("iam connected");
      setIsRoomActive(true);
    });
    return () => {
      socket.off("connect_error");
      socket.off("connect");
    };
  }, []);

  const navigateToTicTac = () => {
    if (!userName) {
      toast.error("Please enter a name");
    } else {
      navigate(AppRoutes.tictac);
    }
  };

  const navigateToChess = () => {
    if (!userName) {
      toast.error("Please enter a name");
    } else {
      console.log("userName: ", userName);
      socket.auth = { username: userName };
      socket.connect();
      navigate(AppRoutes.chess);
    }
  };

  return (
    <div className="gradient-purple flex h-[100vh] flex-col justify-center overflow-hidden">
      <div className="flex w-full items-center justify-center">
        <img src={BrandLogo} alt="P2P Play Hub" />
      </div>
      <div className="mt-6 flex flex-col items-center">
        <div>
          <input
            type="text"
            className="block w-[362px] rounded-lg border border-gray-300 bg-transparent p-2.5 text-sm text-white placeholder-white focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-white dark:focus:border-red-500 dark:focus:ring-red-500"
            placeholder="Your name:"
            required
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="mt-6 flex">
          <button
            className="custom-button custom-button-blue mr-2"
            onClick={navigateToTicTac}
          >
            TicTac
          </button>
          <button
            className="custom-button custom-button-green ml-2"
            onClick={navigateToChess}
          >
            Chess
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
