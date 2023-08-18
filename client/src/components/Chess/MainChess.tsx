//@ts-nocheck
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { checkGameOverState } from "@app/utils/index";

const game = new Chess();

const MainChess = ({ socket, username }) => {
  const [fen, setFen] = useState("start");
  const [play, setPlay] = useState(false);
  const [orientation, setOrientation] = useState("white");
  const [otherusername, setOtherusername] = useState("");
  const [otherid, setOtherid] = useState("");
  const [turn, setTurn] = useState("w");
  const [width, setWidth] = useState(0);
  const [overmessage, setOvermessage] = useState("");

  useEffect(() => {
    socket.on("join", (res) => {
      setPlay(true);
      setTurn(res["white"] === socket.id ? "w" : "b");
      setOrientation(res["black"] === socket.id ? "black" : "white");
      setOtherusername(
        res["white"] === socket.id ? res["blackUsername"] : res["whiteUsername"]
      );
      setOtherid(res["white"] === socket.id ? res["black"] : res["white"]);
    });
    return () => {
      socket.off("join");
    };
  }, []);

  useEffect(() => {
    socket.on("move", ({ sourceSquare, targetSquare }) => {
      let move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
      if (move === null) return;
      checkGameOverState(game);
      setFen(game.fen());
    });
    return () => {
      socket.off("move");
    };
  }, []);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (game.turn() !== turn) {
      return;
    }
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return;
    checkGameOverState(game);
    setFen(game.fen());
    let userturn = game.turn();
    socket.emit("move", { sourceSquare, targetSquare, userturn, otherid });
  };

  const changeWidth = ({ screenWidth }) => {
    if (screenWidth > 600) {
      setWidth(480);
      return;
    }
    setWidth(screenWidth - 30);
  };

  return (
    <div className="MainChess__container bg-img">
      {!play ? (
        <Spinner />
      ) : (
        <div className="MainChess__inside">
          <div
            className={`flex h-[48px] w-full items-center justify-center rounded-lg text-base font-semibold text-white ${
              turn === game.turn() ? "bg-[#0A964B]" : "bg-[#960A0A;]"
            }`}
            style={{ textAlign: "center" }}
          >
            {overmessage === ""
              ? game.turn() === "w"
                ? "Whites turn"
                : "Blacks turn"
              : overmessage}
          </div>
          <div className="username-box mt-2 flex h-[68px] w-full items-center justify-center rounded-t-md">
            Opponent - {otherusername}
          </div>
          <Chessboard
            position={fen}
            width={width}
            calcWidth={changeWidth}
            orientation={orientation}
            onDrop={onDrop}
          />
          <div className="username-box flex h-[68px] w-full items-center justify-center rounded-b-md">
            You - {username}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainChess;
