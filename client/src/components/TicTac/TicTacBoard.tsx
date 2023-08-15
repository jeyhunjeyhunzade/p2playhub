import React, { useEffect, useRef } from "react";
import GameFinished from "@app/game/scenes/GameFinished";
import FindMatch from "@app/game/scenes/FindMatch";
import MainGame from "@app/game/scenes/MainGame";

const TicTacBoard = () => {
  const gameInitialised = useRef(false);

  useEffect(() => {
    if (gameInitialised.current) return;

    const gameConfig = {
      type: Phaser.CANVAS,
      parent: "phaser-game",
      width: 540,
      height: 540,
      backgroundColor: "#fff",
      scene: [FindMatch, MainGame, GameFinished],
    };

    new Phaser.Game(gameConfig);

    gameInitialised.current = true;
  }, []);

  return <div id="phaser-game" className="game"></div>;
};

export default TicTacBoard;
