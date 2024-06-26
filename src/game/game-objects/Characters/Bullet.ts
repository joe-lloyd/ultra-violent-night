import { Physics, GameObjects } from 'phaser';
import { GameLevel1 } from '../../scenes/GameLevel1';
import { MeleeEnemy } from './MeleeEnemy';
import { RangedEnemy } from './RangedEnemy';

export class Bullet extends GameObjects.Ellipse {
  body: Physics.Arcade.Body;

  friendly: boolean;

  hasBeenParried: boolean; // Flag to check if the bullet has been parried

  scene: GameLevel1;

  constructor(scene: GameLevel1, x: number, y: number, friendly = false) {
    super(scene, x, y, 10, 10, 0x00ffff);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;
    this.body = this.body as Physics.Arcade.Body;
    this.friendly = friendly;
    this.hasBeenParried = false; // Initialize parried flag to false
  }

  fire(x: number, y: number, angle: number, speed: number): void {
    this.setPosition(x, y);
    this.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  turnFriendly(): void {
    this.friendly = true;
    this.setFillStyle(0xff0000); // Change color to red to indicate danger to enemies
  }

  reflect(): void {
    if (!this.hasBeenParried) {
      // Check if the bullet has not been parried before
      this.body.velocity.x *= -1;
      this.body.velocity.y *= -1;
      this.turnFriendly();
      this.hasBeenParried = true; // Set the flag to true after parrying
    }
  }

  update(): void {
    if (this.friendly) {
      [
        ...this.scene.spawner.meleeEnemies.getChildren(),
        ...this.scene.spawner.rangedEnemies.getChildren(),
      ].forEach((gameObject) => {
        const enemy = gameObject as RangedEnemy | MeleeEnemy;
        if (this.scene.physics.overlap(this, enemy)) {
          enemy.destroyEnemy();
        }
      });
    }
  }
}
