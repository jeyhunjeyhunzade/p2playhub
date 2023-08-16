import BrandLogo from "@app/assets/p2pPlayHub copy.svg";
import { AppRoutes } from "@app/types/enums";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  if (!name) {
    console.log("No name");
  }

  const navigateToTicTac = () => {
    if (!name) {
      toast.error("Please enter a name");
    } else {
      navigate(AppRoutes.tictac);
    }
  };

  const navigateToChess = () => {
    if (!name) {
      toast.error("Please enter a name");
    } else {
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
            onChange={(e) => {
              setName(e.target.value);
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
