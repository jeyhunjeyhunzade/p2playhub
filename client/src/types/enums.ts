export enum Message {
  PlayerSelection,
}

export enum Cell {
  Empty,
  X,
  O,
}

export enum TicTacResults {
  STILL_PLAYING = "STILL_PLAYING",
  YOU_WON = "YOU_WON",
  OPPONENT_WON = "OPPONENT_WON",
}

export enum AppRoutes {
  main = "/",
  tictac = "/tictac",
  chess = "/chess",
}

export enum ChessOrientation {
  WHITE = "white",
  BLACK = "black",
}
