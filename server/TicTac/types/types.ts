export interface ITicTacToeState {
  board: number[];
  activePlayer: number;
  lastMoveSessionId: string;
  playerX: string;
  playerO: string;
  victorSessionId: string;
}
