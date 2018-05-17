/*
 * Create a list that holds all of your cards
 */
const cards = [
  'diamond',
  'paper-plane-o',
  'anchor',
  'bolt',
  'cube',
  'anchor',
  'leaf',
  'bicycle',
  'diamond',
  'bomb',
  'leaf',
  'bomb',
  'bolt',
  'bicycle',
  'paper-plane-o',
  'cube'
];

const deck = document.getElementById('deck');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Empty the deck
while (deck.firstChild) deck.removeChild(deck.firstChild);

const fragment = document.createDocumentFragment();

shuffle(cards).forEach(function(element) {

  const li = document.createElement('li');
  li.className = 'card';
  li.dataset.symbol = element;

  const i = document.createElement('i');
  i.className = `fa fa-${element}`;

  li.append(i);
  fragment.append(li);

});

// Add the fragment to the deck
deck.append(fragment);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const openCards = [];

function displaySymbol(element) {
  element.classList.add('open');
  element.classList.add('show');
}

function addCardToOpenCards(element) {
  if (!openCards.includes(element)) {
    openCards.push(element);
  }
}

deck.addEventListener('click', function(e) {

  if (e.target.nodeName === 'LI') {

    // Display the card's symbol
    displaySymbol(e.target);

    // Add the card to openCards
    addCardToOpenCards(e.target);

  }

});
