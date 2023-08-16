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
    // when the invited user joins the game,
    // both the user gets to play
    console.log("socket??", socket);
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
    // when a user moves, it is sent back to the other user
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
    // see if the move is legal
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return;
    // check if the game is over, what is the state of it
    // either it is a win, stalemate or other.
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
            className={`MainChess__turn ${
              turn === game.turn() ? "myTurn" : "otherTurn"
            }`}
            style={{ textAlign: "center" }}
          >
            {overmessage === ""
              ? game.turn() === "w"
                ? "whites turn"
                : "blacks turn"
              : overmessage}
          </div>
          <div className="MainChess__other">
            <i className="fas fa-circle"></i>
            &nbsp;
            {otherusername}
          </div>
          <Chessboard
            position={fen}
            width={width}
            calcWidth={changeWidth}
            orientation={orientation}
            onDrop={onDrop}
          />
          <div className="MainChess__you">
            <i className="fas fa-circle"></i> &nbsp;
            {username}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainChess;
