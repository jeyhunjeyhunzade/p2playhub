import { Schema, ArraySchema, type } from "@colyseus/schema";

import { ITicTacToeState } from "../types/types";

export default class TicTacToeState extends Schema implements ITicTacToeState {
  @type(["number"])
  board: ArraySchema<number>;

  @type("number")
  activePlayer = 0;

  @type("string")
  lastMoveSessionId = "";

  @type("string")
  playerX = "";

  @type("string")
  playerO = "";

  @type("string")
  victorSessionId = "";

  constructor() {
    super();

    this.board = new ArraySchema(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
