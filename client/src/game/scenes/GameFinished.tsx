// EndMatch.ts
// - victory/defeat scene and "play again" button

import Phaser from "phaser";
import Server from "@app/game/services/Server";

export default class EndMatch extends Phaser.Scene {
  private server!: Server;

  private againButtonBg!: Phaser.GameObjects.Rectangle;
  private againButtonText!: Phaser.GameObjects.Text;

  private searching = false;

  constructor() {
    super("end-match");
  }

  init() {}

  create(data: { server: Server }) {
    const { width, height } = this.scale;

    const { server } = data;

    this.server = server;

    // button background
    this.againButtonBg = this.add.rectangle(
      width / 2,
      height * 0.85,
      width * 0.8,
      height * 0.1,
      0xffffff
    );
    this.againButtonBg.setInteractive();
    this.againButtonBg.setOrigin(0.5, 0.5);

    // button text
    this.againButtonText = this.add.text(
      width / 2,
      height * 0.85,
      "Play Again",
      {
        color: "#000000",
        fontFamily: "mono",
        fontSize: "24px",
      }
    );
    this.againButtonText.setOrigin(0.5, 0.5);

    // button background on click
    this.againButtonBg.on(Phaser.Input.Events.POINTER_UP, async () => {
      if (this.searching) return;
      this.searching = true;

      this.scene.sleep("main-game");

      this.againButtonText.text = "Searching for opponent";
      this.againButtonText.setFontSize(16);

      if (!this.server) {
        throw new Error("server instance missing");
      }

      await this.server.join();
    });
  }

  update() {
    if (this.server.isFoundMatch()) {
      this.scene.wake("main-game", {
        server: this.server,
      });
      this.scene.stop("end-match");
      this.searching = false;
    }
  }
}
