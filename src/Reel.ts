import * as PIXI from 'pixi.js';

export class Reel {
  private symbols: PIXI.Container;
  private speed: number; // Speed dynamically calculated
  private isSpinning: boolean = false;
  private appHeight: number;
  private rowCount: number;
  private symbolHeight: number;
  private spinDuration: number; // Time for which the reel will spin (in seconds)
  private elapsedTime: number; // Time that has passed since the reel started spinning
  private totalDistance: number; // Total distance the reel will cover in 5 seconds

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

    // Calculate the total distance to travel, which is several symbol heights
    this.totalDistance = this.symbolHeight * this.rowCount * 10; // Adjust 10x the number of rows for smooth movement

    // Calculate the speed (distance per second) so that after `spinDuration` seconds, the reels will align perfectly
    this.speed = this.totalDistance / spinDuration;
  }

  startSpinning() {
    this.isSpinning = true;
    this.elapsedTime = 0; // Reset the elapsed time
  }

  stopSpinning() {
    this.isSpinning = false;
    this.elapsedTime = 0; // Reset elapsed time when stopped
  }

  update(delta: number) {
    if (this.isSpinning) {
      // Increment elapsed time with the delta
      this.elapsedTime += delta / 60; // PIXI's delta is in "frames per second" so we adjust by dividing by 60

      // Move the entire reel down by the calculated speed
      this.symbols.y += this.speed * (delta / 60); // Adjust movement by frame

      // Loop through all symbols and move the ones that go off the screen back to the top
      this.symbols.children.forEach((symbol) => {
        const sprite = symbol as PIXI.Sprite;
        if (sprite.y + this.symbols.y > this.appHeight) {
          // Move the symbol that went off the bottom back to the top
          sprite.y -= this.symbolHeight * this.symbols.children.length;
        }
      });

      // Stop spinning when the elapsed time exceeds the spin duration
      if (this.elapsedTime >= this.spinDuration) {
        this.stopSpinning();
        this.alignSymbols(); // Align symbols after stopping
      }
    }
  }

  // Ensure all symbols align perfectly after stopping
  alignSymbols() {
    // Align the symbols into place based on the current position
    const currentY = this.symbols.y % this.symbolHeight;
    this.symbols.y -= currentY; // Snap the symbols to the nearest row position
  }
}
