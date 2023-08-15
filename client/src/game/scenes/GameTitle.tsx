import Phaser from "phaser";

export default class Title extends Phaser.Scene {
  private titleText!: Phaser.GameObjects.Text;

  constructor() {
    super("title");
  }

  create() {
    const { width, height } = this.scale;

    this.titleText = this.add.text(width / 2, height * 0.05, "TICTAC!", {
      fontFamily: "mono",
      fontSize: "24px",
    });
    this.titleText.setOrigin(0.5, 0);

    this.scene.launch("find-match");
  }
}
