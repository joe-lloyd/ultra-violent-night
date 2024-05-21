import { Scene } from "phaser";
import Player from "../game-objects/Characters/Player.ts";
import { EventBus } from "../EventBus";
import { BackgroundGrid } from "../game-objects/Level/BackgroundGrid.ts";
import { EnemySpawner } from "../game-objects/Characters/EnemySpawner.ts";
import { MeleeEnemy } from "../game-objects/Characters/MeleeEnemy.ts";
import { RangedEnemy } from "../game-objects/Characters/RangedEnemy.ts";

export class BaseGame extends Scene {
  player: Player;
  bullets: Phaser.GameObjects.Group;
  camera: Phaser.Cameras.Scene2D.Camera;
  spawner: EnemySpawner;
  backgroundGrid: BackgroundGrid;
  width: number = 1024;
  height: number = 768;
  gridSize: number = 32;
  meleeEnemies: MeleeEnemy[];
  rangedEnemies: RangedEnemy[];

  constructor(config: string) {
    super(config);
    this.backgroundGrid = new BackgroundGrid(this, this.gridSize);
  }

  create() {
    this.physics.world.setBounds(0, 0, this.width, this.height);
    this.physics.world.timeScale = 1;

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);
    EventBus.emit("current-scene-ready", this);
    EventBus.emit("display-time-scale", `Time Scale: ${this.physics.world.timeScale.toFixed(3)}`);

    this.backgroundGrid.initializeGraphics();
  }
  update(_time: number, delta: number) {
    this.backgroundGrid.draw();
    this.player.update(_time, delta);

    EventBus.emit("display-time-scale", `Time Scale: ${this.physics.world.timeScale.toFixed(3)}`);
  }
}
