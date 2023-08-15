// FindMatch.ts
// - first scene that loads on booting up the page
// - use this to find a new game

import Phaser from "phaser";
import Server from "@app/game/services/Server";

export default class FindMatch extends Phaser.Scene {
  private server!: Server;
  private findButtonBg!: Phaser.GameObjects.Rectangle;
  private findButtonText!: Phaser.GameObjects.Text;

  private searching = false;

  constructor() {
    super("find-match");
  }

  init() {
    this.server = new Server();
  }

  create() {
    const { width, height } = this.scale;

    // button background
    this.findButtonBg = this.add.rectangle(
      width / 2,
      height * 0.85,
      width * 0.4,
      height * 0.1,
      0x0a964b
    );
    this.findButtonBg.setInteractive();
    this.findButtonBg.setOrigin(0.5, 0.5);

    // button text
    this.findButtonText = this.add.text(
      width / 2,
      height * 0.85,
      "Find Match",
      {
        color: "#fff",
        fontFamily: "Inter",
        fontSize: "24px",
      }
    );
    this.findButtonText.setOrigin(0.5, 0.5);

    // button background on click
    this.findButtonBg.on(Phaser.Input.Events.POINTER_UP, async () => {
      if (this.searching) return;
      this.searching = true;

      this.findButtonText.text = "Searching for opponent";
      this.findButtonText.setFontSize(16);

      if (!this.server) {
        throw new Error("server instance missing");
      }

      await this.server.join();
    });
  }

  update() {
    if (this.server.isFoundMatch()) {
      this.scene.launch("main-game", {
        server: this.server,
      });
      this.scene.stop("find-match");
    }
  }
}
