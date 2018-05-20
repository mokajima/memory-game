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

let openCards;

let moveCounter;

const deck = document.getElementById('deck');
const stars = document.getElementById('stars');
const moves = document.getElementById('moves');

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

// Initizalize the game
function initialize() {

  // Empty openCards
  openCards = [];

  // Reset the move counter
  moveCounter = 0;
  moves.textContent = moveCounter;

  // Reset the stars
  stars.querySelectorAll('.fa-star-o').forEach(function(element) {
    element.className = 'fa fa-star';
  });

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

}

initialize();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol
 *  - add the card to a *list* of "open" cards
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol
 *    + increment the move counter and display it on the page
 *    + if all cards have matched, display a message with the final score
 */

function displaySymbol(element) {
  element.classList.add('open');
  element.classList.add('show');
}

function hideSymbol(element) {
  element.classList.remove('open');
  element.classList.remove('show');
}

function addCardToOpenCards(element) {
  if (!openCards.includes(element)) {
    openCards.push(element);
  }
}

function removeCardFromOpenCards() {
  return openCards.pop();
}

function lockCard(element) {
  element.classList.add('match');

  // Add classes for CSS animations
  element.classList.add('animated');
  element.classList.add('rubberBand');
}

function updateMoveCounter() {
  moves.textContent = ++moveCounter;
}

function updateStars() {

  // Remove a star according to the number of moves
  switch (moveCounter) {
    case 12:
      stars.querySelector('li:last-child i').className += '-o';
      break;
    case 16:
      stars.querySelector('li:nth-child(2) i').className += '-o';
      break;
  }

}

function gameOver() {

  // Set the final score in a message
  document.getElementById('modal__moves').textContent = moveCounter;
  document.getElementById('modal__stars').textContent = stars.querySelectorAll('.fa-star').length;

  // Display the modal
  modal.classList.add('is-active');

}

deck.addEventListener('click', function(e) {

  if (e.target.nodeName === 'LI') {

    // Display the card's symbol
    displaySymbol(e.target);

    // Add the card to openCards
    addCardToOpenCards(e.target);

    // Check to see if the two cards match
    if (0 === openCards.length % 2) {

      // Get selected cards
      let cardOne = openCards[openCards.length - 1];
      let cardTwo = openCards[openCards.length - 2];

      if (cardOne.dataset.symbol === cardTwo.dataset.symbol) {

        // If the cards do match, lock the cards in the open position
        lockCard(cardOne);
        lockCard(cardTwo);

      } else {

        // if the cards do not match, remove the cards from the list and hide the card's symbol
        cardOne = removeCardFromOpenCards();
        cardTwo = removeCardFromOpenCards();

        setTimeout(function() {
          hideSymbol(cardOne);
          hideSymbol(cardTwo);
        }, 1000);

      }

      // Update the score panel
      updateMoveCounter();
      updateStars();

      // Finish the game
      if (16 === openCards.length) {
        gameOver();
      }

    }

  }

});

document.getElementById('restart').addEventListener('click', function() {
  initialize();
});

document.getElementById('modal__restart').addEventListener('click', function() {

  // Hide the modal
  modal.classList.remove('is-active');

  // Initialize the game
  initialize();

});
