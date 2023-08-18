import swal from "sweetalert";

export const classNames = (...classes: Array<string | null>) => {
  return classes.filter(Boolean).join(" ");
};

export const checkGameOverState = (game: any) => {
  if (game.game_over()) {
    if (game.in_draw()) {
      swal({ title: "Its a draw", icon: "info" });
    } else if (game.in_stalemate()) {
      swal({ title: "its a stalemate.", icon: "info" });
    } else if (game.in_threefold_repetition()) {
      swal({ title: "its a threefold repitition.", icon: "info" });
    } else if (game.insufficient_material()) {
      swal({
        title: "game over due to insufficient material.",
        icon: "info",
      });
    } else {
      swal({
        title: game.turn() === "w" ? "black wins" : "white wins",
        icon: "success",
      });
    }
  }
};
