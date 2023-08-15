import Phaser from "phaser";
import Server from "@app/game/services/Server";

import { Cell, TicTacResults } from "@app/types/enums";
import { ITicTacToeState } from "@app/types/types";

import crossImage from "@app/game/assets/cross.png";
import circleImage from "@app/game/assets/circle.png";

export default class MainGame extends Phaser.Scene {
  private server?: Server;
  private cellImages: Phaser.GameObjects.Image[] = [];
  private infoText!: Phaser.GameObjects.Text;

  constructor() {
    super("main-game");
  }

  preload() {
    this.load.image("cross", crossImage);
    this.load.image("circle", circleImage);
  }

  async create(data: { server: Server }) {
    const { server } = data;

    this.server = server;

    this.createBoard();
    this.createGui();

    this.server.onStateChanged(this.updateBoard);
    this.server.onStateChanged(this.updateGui);
    this.server.onStateChanged(this.updateVictory);
    this.server.onOpponentDisconnect(this.opponentDisconnect);
  }

  private opponentDisconnect = () => {
    this.infoText.text = "Opponent left...";

    this.server?.leave();
    this.scene.pause("main-game");
    this.scene.launch("end-match", {
      server: this.server,
    });
  };

  private createBoard = () => {
    const state = this.server?.getState();
    if (!state) return;

    const { width, height } = this.scale;
    const size = 120;
    const spacing = 8;

    let x = width * 0.5 - size - spacing;
    let y = height * 0.4 - size - spacing;

    state.board.forEach((cellState, idx) => {
      this.add
        .rectangle(x, y, size, size, 0x6042b8)
        .setInteractive()
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
          this.server?.makeSelection(idx);
        });
      const cellImage = this.add.image(x, y, "cross");
      cellImage.setDisplaySize(size * 0.9, size * 0.9);
      cellImage.setVisible(false);
      this.cellImages.push(cellImage);

      x += size + spacing;

      if ((idx + 1) % 3 === 0) {
        y += size + spacing;
        x = width * 0.5 - size - spacing;
      }
    });
  };

  private createGui = () => {
    this.infoText = this.add.text(20, this.scale.height - 20, "Your turn", {
      fontFamily: "Inter",
      fontSize: "20px",
      color: "#0A964B",
    });
    this.infoText.setOrigin(0, 1);

    if (this.server?.isMyTurn()) {
      this.infoText.text = "Your turn player " + this.server.getMyMarker();
    } else {
      this.infoText.text =
        "Player " + this.server?.getOthersMarker() + "'s turn";
    }
  };

  private updateBoard = (state: ITicTacToeState) => {
    state.board.forEach((cell, idx) => {
      switch (cell) {
        case Cell.X: {
          this.cellImages[idx].setTexture("cross");
          this.cellImages[idx].setVisible(true);
          break;
        }
        case Cell.O: {
          this.cellImages[idx].setTexture("circle");
          this.cellImages[idx].setVisible(true);
          break;
        }
        default: {
          this.cellImages[idx].setVisible(false);
          break;
        }
      }
    });
  };

  private updateGui = (state: ITicTacToeState) => {
    if (this.server?.isMyTurn()) {
      this.infoText.text = "Your turn player " + this.server.getMyMarker();
    } else {
      this.infoText.text =
        "Player " + this.server?.getOthersMarker() + "'s turn";
    }
  };

  private updateVictory = (state: ITicTacToeState) => {
    const victor = this.server?.getVictor();
    if (victor === TicTacResults.STILL_PLAYING) return;

    if (victor === TicTacResults.YOU_WON) {
      this.infoText.text = "You won!";
    } else if (victor === TicTacResults.OPPONENT_WON) {
      this.infoText.text = "Opponent won...";
    }

    this.server?.leave();
    this.scene.pause("main-game");
    this.scene.launch("end-match", {
      server: this.server,
    });
  };
}
