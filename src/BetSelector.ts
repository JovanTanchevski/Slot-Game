// BetSelector.ts
import * as PIXI from 'pixi.js';

export class BetSelector {
  private betAmounts: number[];
  private currentBetIndex: number;
  private button: HTMLButtonElement;
  private betList: HTMLUListElement;

  constructor(betAmounts: number[]) {
    this.betAmounts = betAmounts;
    this.currentBetIndex = 0;

    // Create the bet amount button
    this.button = document.createElement('button');
    this.button.innerText = `${this.betAmounts[this.currentBetIndex]} $`;
    this.button.onclick = () => this.toggleBetList();
    document.body.appendChild(this.button);

    // Create the bet list
    this.betList = document.createElement('ul');
    this.betList.style.overflowY = 'scroll'; // Make it scrollable
    this.betList.style.width = '200px'; // Customize width
    this.betList.style.height = '100px'; // Customize height
    this.betList.style.border = '1px solid #ccc';
    this.betList.style.display = 'none'; // Hide initially

    this.betAmounts.forEach((bet, index) => {
      const listItem = document.createElement('li');
      listItem.innerText = `${bet} $`;
      listItem.style.cursor = 'pointer';
      listItem.onclick = () => this.selectBet(index);
      this.betList.appendChild(listItem);
    });

    document.body.appendChild(this.betList);

    // Create plus and minus buttons
    this.createAdjustButtons();
  }

  private createAdjustButtons() {
    const plusButton = document.createElement('button');
    plusButton.innerText = '+';
    plusButton.onclick = () => this.increaseBet();

    const minusButton = document.createElement('button');
    minusButton.innerText = '-';
    minusButton.onclick = () => this.decreaseBet();

    document.body.appendChild(minusButton);
    document.body.appendChild(plusButton);
  }

  private toggleBetList() {
    this.betList.style.display =
      this.betList.style.display === 'none' ? 'block' : 'none';
  }

  private selectBet(index: number) {
    this.currentBetIndex = index;
    this.button.innerText = `${this.betAmounts[this.currentBetIndex]} $`;
    this.updateHighlight();
    this.betList.style.display = 'none'; // Hide the list after selection
  }

  private updateHighlight() {
    const items = this.betList.getElementsByTagName('li');
    Array.from(items).forEach((item, index) => {
      item.style.backgroundColor =
        index === this.currentBetIndex ? '#d3d3d3' : 'transparent'; // Highlight the selected item
    });
  }

  private increaseBet() {
    this.currentBetIndex = (this.currentBetIndex + 1) % this.betAmounts.length; // Cycle to the first bet if at the end
    this.button.innerText = `${this.betAmounts[this.currentBetIndex]} $`;
    this.updateHighlight();
  }

  private decreaseBet() {
    this.currentBetIndex =
      (this.currentBetIndex - 1 + this.betAmounts.length) %
      this.betAmounts.length; // Cycle to the last bet if at the beginning
    this.button.innerText = `${this.betAmounts[this.currentBetIndex]} $`;
    this.updateHighlight();
  }
}
