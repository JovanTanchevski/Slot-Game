export class BetSelector {
  private betAmounts: number[];
  private currentBetIndex: number;
  private button: HTMLButtonElement;
  private betList: HTMLUListElement;

  constructor(
    betAmounts: number[],
    width: string = '200px',
    height: string = '100px'
  ) {
    this.betAmounts = betAmounts;
    this.currentBetIndex = 0;

    this.button = document.createElement('button');
    this.button.innerText = `${this.betAmounts[this.currentBetIndex]} $`;
    this.button.onclick = () => this.toggleBetList();
    document.body.appendChild(this.button);

    this.betList = document.createElement('ul');
    this.betList.style.overflowY = 'auto';
    this.betList.style.width = width;
    this.betList.style.height = height;
    this.betList.style.border = '1px solid #ccc';
    this.betList.style.display = 'none';

    this.betAmounts.forEach((bet, index) => {
      const listItem = document.createElement('li');
      listItem.innerText = `${bet} $`;
      listItem.style.cursor = 'pointer';
      listItem.style.padding = '10px';
      listItem.style.listStyle = 'none';
      listItem.onclick = () => this.selectBet(index);
      this.betList.appendChild(listItem);
    });

    document.body.appendChild(this.betList);

    this.adjustFontSize();
    this.createAdjustButtons();
  }

  private adjustFontSize() {
    const containerWidth = this.betList.offsetWidth;

    Array.from(this.betList.children).forEach((listItem) => {
      const listItemElement = listItem as HTMLElement;
      const betAmount = listItemElement.innerText;

      let fontSize = containerWidth / betAmount.length;

      fontSize = Math.max(Math.min(fontSize, 20), 10);

      listItemElement.style.fontSize = `${fontSize}px`;
    });
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
    this.betList.style.display = 'none';
  }

  private updateHighlight() {
    const items = this.betList.getElementsByTagName('li');
    Array.from(items).forEach((item, index) => {
      item.style.backgroundColor =
        index === this.currentBetIndex ? '#d3d3d3' : 'transparent';
    });
  }

  private increaseBet() {
    this.currentBetIndex = (this.currentBetIndex + 1) % this.betAmounts.length;
    this.button.innerText = `${this.betAmounts[this.currentBetIndex]} $`;
    this.updateHighlight();
  }

  private decreaseBet() {
    this.currentBetIndex =
      (this.currentBetIndex - 1 + this.betAmounts.length) %
      this.betAmounts.length;
    this.button.innerText = `${this.betAmounts[this.currentBetIndex]} $`;
    this.updateHighlight();
  }
}
