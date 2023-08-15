import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { Cell } from "../types/enums";
import TicTacToe from "../models/TicTacToe";

type Payload = {
  client: Client;
  index: number;
};

export class PlayerControls extends Command<TicTacToe, Payload> {
  execute(data: Payload) {
    const { client, index } = data;

    const clientIndex = this.room.clients.findIndex((c) => c.id === client.id);
    const cellValue = clientIndex === 0 ? Cell.X : Cell.O;

    if (
      this.room.state.board[index] === Cell.Empty &&
      this.room.state.activePlayer === clientIndex
    ) {
      this.room.state.board[index] = cellValue;
      this.room.state.activePlayer = this.room.state.activePlayer === 0 ? 1 : 0;
      this.room.state.lastMoveSessionId = client.sessionId;

      if (this.checkForVictory(cellValue)) {
        this.room.state.victorSessionId = client.sessionId;
      }
    }
  }

  checkForVictory(value: number) {
    const board = this.room.state.board;
    // check verticals
    if (board[0] === value && board[3] === value && board[6] === value)
      return true;
    if (board[1] === value && board[4] === value && board[7] === value)
      return true;
    if (board[2] === value && board[5] === value && board[8] === value)
      return true;

    // check horizontals
    if (board[0] === value && board[1] === value && board[2] === value)
      return true;
    if (board[3] === value && board[4] === value && board[5] === value)
      return true;
    if (board[6] === value && board[7] === value && board[8] === value)
      return true;

    // check diagonals
    if (board[0] === value && board[4] === value && board[8] === value)
      return true;
    if (board[2] === value && board[4] === value && board[6] === value)
      return true;

    // no matches
    return false;
  }
}
