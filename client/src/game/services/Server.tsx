import { Client, Room } from "colyseus.js";
import { Schema } from "@colyseus/schema";
import { EventEmitter } from "events";

import { ITicTacToeState } from "@app/types/types";
import { Message } from "@app/types/enums";

export default class Server {
  private client: Client;

  private eventEmitter = new EventEmitter();

  private room?: Room<ITicTacToeState & Schema>;

  private foundMatch = false;

  constructor() {
    // this.client = new Client('ws://localhost:2567');
    this.client = new Client("wss://server.tictactoe.blakemasondev.com");
  }

  async join() {
    this.room = await this.client.joinOrCreate<ITicTacToeState & Schema>(
      "tic-tac-toe"
    );

    this.room.onStateChange((state) => {
      this.eventEmitter.emit("on-state-changed", state);
    });

    this.room.onMessage("found-match", (state) => {
      this.foundMatch = true;
      this.eventEmitter.emit("once-state-changed", state);
    });

    this.room.onMessage("client-left", (sessionId) => {
      this.eventEmitter.emit("opponent-disconnected");
    });
  }

  leave() {
    this.foundMatch = false;
    this.room?.leave();
  }

  getState() {
    return this.room?.state;
  }

  isFoundMatch() {
    return this.foundMatch;
  }

  makeSelection(idx: number) {
    if (!this.room) return;

    this.room.send(Message.PlayerSelection, { index: idx });
  }

  onStateChanged(cb: (state: ITicTacToeState) => void) {
    this.eventEmitter.on("on-state-changed", cb);
  }

  onOpponentDisconnect(cb: (state: ITicTacToeState) => void) {
    this.eventEmitter.on("opponent-disconnected", cb);
  }

  isMyTurn() {
    return this.room?.sessionId !== this.room?.state.lastMoveSessionId;
  }

  getMyMarker() {
    if (this.room?.sessionId === this.room?.state.playerX) {
      return "X";
    } else {
      return "O";
    }
  }

  getOthersMarker() {
    if (this.room?.sessionId === this.room?.state.playerX) {
      return "O";
    } else {
      return "X";
    }
  }

  getVictor() {
    switch (this.room?.state.victorSessionId) {
      case "": {
        return "STILL_PLAYING";
      }
      case this.room?.sessionId: {
        return "YOU_WON";
      }
      default: {
        return "OPPONENT_WON";
      }
    }
  }
}
