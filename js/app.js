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

let intervalId;
let timeCounter;
let openCards;
let moveCounter;

const deck = document.getElementById('deck');
const time = document.getElementById('time');
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

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
* @description Initizalize the game
*/
function initialize() {

  // Empty openCards
  openCards = [];

  // Reset the timer
  timeCounter = 0;
  time.textContent = timeCounter;

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = '';
  }

  // Reset the move counter
  moveCounter = 0;
  moves.textContent = moveCounter;

  // Reset the stars
  stars.querySelectorAll('.fa-star-o').forEach(element => {
    element.className = 'fa fa-star';
  });

  // Empty the deck
  while (deck.firstChild) deck.removeChild(deck.firstChild);

  const fragment = document.createDocumentFragment();

  shuffle(cards).forEach(element => {

    const li = document.createElement('li');
    li.className = 'card';
    li.dataset.symbol = element;
    li.tabIndex = 0;

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

/**
* @description Display a card's symbol
* @param {object} element - An element object whose symbol to display
*/
function displaySymbol(element) {
  element.classList.add('open', 'show');
}

/**
* @description Hide a card's symbol
* @param {object} element - An element object whose symbol to hide
*/
function hideSymbol(element) {
  element.classList.remove('open', 'show');
}

/**
* @description Add a card to openCards array
* @param {object} element - An element object to add to openCards
*/
function addCardToOpenCards(element) {
  if (!openCards.includes(element)) {
    openCards.push(element);
  }
}

/**
* @description Remove a card from openCards array
* @returns {object} The element object removed from openCards array
*/
function removeCardFromOpenCards() {
  return openCards.pop();
}

/**
* @description Lock a card in the open position
* @param {object} element - An element object to lock
*/
function lockCard(element) {

  // Lock the card
  element.classList.add('match');

  // Add classes for CSS animations
  element.classList.add('animated', 'rubberBand');
}

/**
* @description Update the move counter
*/
function updateMoveCounter() {
  moves.textContent = ++moveCounter;
}

/**
* @description Update stars
*/
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

/**
* @description Display the modal with the final score
*/
function gameOver() {

  // Stop the timer
  clearInterval(intervalId);

  // Set the final score in a message
  document.getElementById('modal__time').textContent = timeCounter;
  document.getElementById('modal__moves').textContent = moveCounter;
  document.getElementById('modal__stars').textContent = stars.querySelectorAll('.fa-star').length;

  // Display the modal
  modal.classList.add('is-active');

}


/**
* @description flip a card selected
* @param {object} e - An event object
*/
function flipCard(e) {

  if (e.target.nodeName === 'LI') {

    // Start the timer
    if (!intervalId) {
      intervalId = setInterval(() => {
        time.textContent = ++timeCounter;
      }, 1000);
    }

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

        // Add classes for CSS animations
        cardOne.classList.add('animated', 'wobble');
        cardTwo.classList.add('animated', 'wobble');

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

}

deck.addEventListener('click', flipCard);

/*
 * Flip a card using the space key
 */
deck.addEventListener('keypress', e => {

  if ('Space' === e.code) {
    e.preventDefault();
    flipCard(e);
  }

});

document.addEventListener('animationend', e => {

  if (e.target.classList.contains('card') && 'wobble' === e.animationName) {

    // Remove classes for CSS animations
    e.target.classList.remove('animated', 'wobble');

    // Hide the card's symbol after CSS animations end
    setTimeout(() => {
      hideSymbol(e.target);
    }, 200);

  } else if (e.target.classList.contains('modal') && 'zoomOut' === e.animationName) {

    // Hide the modal
    e.target.classList.remove('is-active');

    // Remove classes for CSS animations
    e.target.classList.remove('animated', 'zoomOut');
  }

});

/*
 * Restart the game
 */
document.getElementById('restart').addEventListener('click', initialize);

document.getElementById('modal__restart').addEventListener('click', () => {

  // Hide the modal
  modal.classList.add('animated', 'zoomOut');

  // Initialize the game
  initialize();

});
