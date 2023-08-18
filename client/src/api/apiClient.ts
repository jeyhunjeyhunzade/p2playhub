export const socketServerUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:8000"
    : "https://p2p-chess-server-ed02dae8885b.herokuapp.com";
