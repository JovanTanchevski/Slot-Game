import * as PIXI from 'pixi.js';
import { Reel } from './Reel';
import { BetSelector } from './BetSelector';

document.addEventListener('DOMContentLoaded', () => {
  const reelCount = 5; // Number of reels
  const rowCount = 3; // Number of rows (3 rows visible at a time)
  const appWidth = window.innerWidth;
  const appHeight = 600;
  const reelWidth = appWidth / reelCount; // Each reel takes a portion of the screen width
  const spinDuration = 5; // Duration of the spin in seconds
  const staggerDelay = 200; // Delay between reels (in milliseconds)
  const betAmounts = [1, 5, 10, 20, 50]; // Array of bet amounts

  // Create the PixiJS Application
  const app = new PIXI.Application({
    width: appWidth,
    height: appHeight,
    backgroundColor: 0x000000, // Set background to black
  });

  // Append the canvas to the game container
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.appendChild(app.view);
  } else {
    console.error('Game container not found!');
    return;
  }

  // Initialize the BetSelector
  const betSelector = new BetSelector(betAmounts); // Create BetSelector instance

  // List of asset URLs
  const assetPaths = [
    'assets/cherry.png',
    'assets/lemon.png',
    'assets/orange.png',
    'assets/grape.png',
    'assets/watermelon.png',
  ];

  // Load the assets (images for the slot machine)
  const loader = new PIXI.Loader();
  assetPaths.forEach((path) => loader.add(path));
  loader.load((loader, resources) => {
    const reelContainer = new PIXI.Container();
    app.stage.addChild(reelContainer);

    // Create 5 reels with 3 rows of symbols each
    const reels: Reel[] = [];
    for (let i = 0; i < reelCount; i++) {
      // Create the symbols container for each reel
      const reelSymbols = new PIXI.Container();
      reelSymbols.x = i * reelWidth; // Position each reel horizontally

      // Add symbols for continuous scrolling
      for (let j = 0; j < rowCount + 1; j++) {
        // Add extra symbol for smooth looping
        const texture = getRandomSymbol(resources);
        const slotSymbol = new PIXI.Sprite(texture);

        // Set the size and positioning for each symbol
        slotSymbol.width = reelWidth * 0.9; // Slight padding within the reel
        slotSymbol.height = (appHeight / rowCount) * 0.9; // Scale according to row height
        slotSymbol.x = reelWidth * 0.05; // Center the symbol horizontally within the reel
        slotSymbol.y = j * (appHeight / rowCount); // Position each symbol on the reel vertically
        reelSymbols.addChild(slotSymbol);
      }

      reelContainer.addChild(reelSymbols);
      reels.push(new Reel(reelSymbols, appHeight, rowCount, spinDuration)); // Pass height, row count, and spin duration to Reel
    }

    // Spin button to start spinning with staggered start
    createSpinButton(reels, staggerDelay);

    // Add the ticker to update the reels continuously
    app.ticker.add((delta) => {
      reels.forEach((reel) => reel.update(delta));
    });
  });
});

// Function to get a random symbol texture
function getRandomSymbol(
  resources: Partial<Record<string, PIXI.LoaderResource>>
) {
  const symbols = [
    resources['assets/cherry.png']?.texture,
    resources['assets/lemon.png']?.texture,
    resources['assets/orange.png']?.texture,
    resources['assets/grape.png']?.texture,
    resources['assets/watermelon.png']?.texture,
  ];
  return symbols[Math.floor(Math.random() * symbols.length)] as PIXI.Texture;
}

// Function to create a spin button with staggered start
function createSpinButton(reels: Reel[], staggerDelay: number) {
  const spinButton = document.createElement('button');
  spinButton.innerText = 'Spin';
  document.body.appendChild(spinButton);
  spinButton.addEventListener('click', () => {
    // Start each reel with a staggered delay
    reels.forEach((reel, index) => {
      setTimeout(() => {
        reel.startSpinning();
      }, index * staggerDelay); // Delay each reel by `staggerDelay * index`
    });

    // Stop all reels after 5 seconds (even though they start at different times)
    setTimeout(() => {
      reels.forEach((reel) => reel.stopSpinning());
    }, 5000 + staggerDelay * (reels.length - 1)); // Ensure the last reel stops after its staggered delay
  });
}
