import * as PIXI from 'pixi.js';

export class Reel {
  private symbols: PIXI.Container;
  private speed: number;
  private isSpinning: boolean = false;
  private appHeight: number;
  private rowCount: number;
  private symbolHeight: number;
  private spinDuration: number;
  private elapsedTime: number;
  private totalDistance: number;
  private stopping: boolean = false;
  private targetY: number = 0;

  constructor(
    symbols: PIXI.Container,
    appHeight: number,
    rowCount: number,
    spinDuration: number
  ) {
    this.symbols = symbols;
    this.appHeight = appHeight;
    this.rowCount = rowCount;
    this.symbolHeight = appHeight / rowCount;
    this.spinDuration = spinDuration;
    this.elapsedTime = 0;
    this.totalDistance = this.symbolHeight * this.rowCount * 10;
    this.speed = this.totalDistance / spinDuration;
  }

  startSpinning() {
    this.isSpinning = true;
    this.stopping = false;
    this.elapsedTime = 0;
  }

  stopSpinning() {
    this.stopping = true;
    this.targetY = this.calculateSnapPosition();
  }

  update(delta: number) {
    if (this.isSpinning) {
      this.elapsedTime += delta / 60;
      this.symbols.y += this.speed * (delta / 60);

      this.symbols.children.forEach((symbol) => {
        const sprite = symbol as PIXI.Sprite;
        if (sprite.y + this.symbols.y > this.appHeight) {
          sprite.y -= this.symbolHeight * this.symbols.children.length;
        }
      });

      if (this.stopping || this.elapsedTime >= this.spinDuration) {
        this.isSpinning = false;
        this.alignSymbols();
      }
    }
  }

  calculateSnapPosition(): number {
    const currentY = this.symbols.y % this.symbolHeight;
    const distanceToNextSymbol = this.symbolHeight - currentY;
    return this.symbols.y + distanceToNextSymbol;
  }

  alignSymbols() {
    const currentY = this.symbols.y % this.symbolHeight;
    const snapDistance = currentY !== 0 ? this.symbolHeight - currentY : 0;
    this.symbols.y += snapDistance;
  }
}
