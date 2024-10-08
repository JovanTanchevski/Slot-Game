import * as PIXI from 'pixi.js';
import { Reel } from './Reel';
import { BetSelector } from './BetSelector';

document.addEventListener('DOMContentLoaded', () => {
  const reelCount = 5;
  const rowCount = 3;
  const appWidth = window.innerWidth;
  const appHeight = 600;
  const reelWidth = appWidth / reelCount;
  const spinDuration = 5;
  const staggerDelay = 200;
  const betAmounts = [1, 5, 10, 20, 50];

  const app = new PIXI.Application({
    width: appWidth,
    height: appHeight,
    backgroundColor: 0x000000,
  });

  const gameContainer = document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.appendChild(app.view);
  } else {
    console.error('Game container not found!');
    return;
  }

  const betSelector = new BetSelector(
    [1, 5, 10, 20, 50, 100, 200, 500, 1000],
    '150px',
    '100px'
  );

  const assetPaths = [
    'assets/cherry.png',
    'assets/lemon.png',
    'assets/orange.png',
    'assets/grape.png',
    'assets/watermelon.png',
  ];

  const loader = new PIXI.Loader();
  assetPaths.forEach((path) => loader.add(path));
  loader.load((loader, resources) => {
    const reelContainer = new PIXI.Container();
    app.stage.addChild(reelContainer);

    const reels: Reel[] = [];
    for (let i = 0; i < reelCount; i++) {
      const reelSymbols = new PIXI.Container();
      reelSymbols.x = i * reelWidth;

      for (let j = 0; j < rowCount + 1; j++) {
        const texture = getRandomSymbol(resources);
        const slotSymbol = new PIXI.Sprite(texture);

        slotSymbol.width = reelWidth * 0.9;
        slotSymbol.height = (appHeight / rowCount) * 0.9;
        slotSymbol.x = reelWidth * 0.05;
        slotSymbol.y = j * (appHeight / rowCount);
        reelSymbols.addChild(slotSymbol);
      }

      reelContainer.addChild(reelSymbols);
      reels.push(new Reel(reelSymbols, appHeight, rowCount, spinDuration));
    }

    createSpinButton(reels, staggerDelay);

    app.ticker.add((delta) => {
      reels.forEach((reel) => reel.update(delta));
    });
  });
});

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

let isSpinning = false;

function createSpinButton(reels: Reel[], staggerDelay: number) {
  const spinButton = document.createElement('button');
  spinButton.innerText = 'Spin';
  document.body.appendChild(spinButton);

  spinButton.addEventListener('click', () => {
    if (!isSpinning) {
      isSpinning = true;
      spinButton.innerText = 'Stop';

      reels.forEach((reel, index) => {
        setTimeout(() => {
          reel.startSpinning();
        }, index * staggerDelay);
      });
    } else {
      isSpinning = false;
      spinButton.innerText = 'Spin';

      reels.forEach((reel) => reel.stopSpinning());
    }
  });
}
