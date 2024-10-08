import { BetSelector } from '../BetSelector';

describe('BetSelector', () => {
  let betSelector: BetSelector;

  beforeEach(() => {
    document.body.innerHTML = `<div id="game-container"></div>`;
    betSelector = new BetSelector([1, 5, 10, 20, 50]);
  });

  test('should display initial bet amount', () => {
    const button = document.querySelector('button') as HTMLButtonElement;
    expect(button.innerText).toBe('1 $');
  });

  test('should update bet amount on list item click', () => {
    const listItem = document.querySelectorAll('li')[2];
    listItem.click();
    const button = document.querySelector('button') as HTMLButtonElement;
    expect(button.innerText).toBe('10 $');
  });

  test('should highlight selected bet amount', () => {
    const listItem = document.querySelectorAll('li')[1];
    listItem.click();
    const highlightedItem = document.querySelector(
      'li[style*="background-color: rgb(211, 211, 211);"]'
    );
    expect(highlightedItem).toBeTruthy();
  });
});
