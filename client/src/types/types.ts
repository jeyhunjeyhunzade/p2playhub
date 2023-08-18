export interface ITicTacToeState {
  board: number[];
  activePlayer: number;
  lastMoveSessionId: string;
  playerX: string;
  playerO: string;
  victorSessionId: string;
}

export interface AppContextShape {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  isRoomActive: boolean;
  setIsRoomActive: React.Dispatch<React.SetStateAction<boolean>>;
}
