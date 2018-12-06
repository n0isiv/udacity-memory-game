/**
 * Randomly shuffle the given array using the Fisher-Yates algorithm.
 * https://stackoverflow.com/a/2450976/1293256
 *
 * @param {any[]} array The array to shuffle
 *
 * @returns {any[]} The shuffled array
 */
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
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
 * Create matrix from the given list.
 * https://stackoverflow.com/a/4492417
 *
 * @param {any[]} list List to be converted to a matrix
 * @param {number} elementsPerSubArray Number of elements per sub-array
 *
 * @returns {any[][]} The generated matrix
 */
function listToMatrix(list, elementsPerSubArray) {
  var matrix = [],
    i,
    k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}

/**
 * Remove all child nodes from the element.
 *
 * @param {HTMLElement} element
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Update the inner text of the given element
 *
 * @param {HTMLElement} element
 * @param {string} text
 */
function updateInnerText(element, text) {
  element.innerText = text;
}

/**
 * Generates 4 rows with 4 icons each
 *
 * @param {string[]} icons List of icon names (must be 8)
 *
 * @returns {string[][]} The generated rows
 */
function generateRows(icons) {
  let rows = [];

  // insert each icon twice
  icons.forEach(iconName => rows.push(iconName, iconName));

  // shuffle the items
  shuffle(rows);

  // turn array into two-dimensional matrix (representing the rows)
  rows = listToMatrix(rows, 4);

  return rows;
}

/**
 * Takes the rows generated with `generateRows`
 * and puts them in a document fragment.
 */

/**
 * Puts the rows generated with the `generateRows` function in a document fragment.
 *
 * @param {string[][]} rows
 *
 * @returns {DocumentFragment} The generated document fragment
 */
function renderRowsInFragment(rows) {
  const fragment = document.createDocumentFragment();

  rows.forEach(row => {
    const rowElm = document.createElement("div");

    rowElm.classList.add("wrapper__row");

    row.forEach(card => {
      const cardElm = document.createElement("div");
      const iconElm = document.createElement("i");

      cardElm.classList.add("wrapper__card");
      iconElm.classList.add(`icon-${card}`, "icon--invisible");
      iconElm.dataset.icon = card;

      cardElm.appendChild(iconElm);
      rowElm.appendChild(cardElm);
    });

    fragment.appendChild(rowElm);
  });

  return fragment;
}

/**
 * Sets the 'icon--invisible` class on the given `iconElms`.
 *
 * @param  {...HTMLElement} iconElms
 */
function hideIconElements(...iconElms) {
  iconElms.forEach(iconElm => iconElm.classList.add("icon--invisible"));
}

/**
 * Convert the given `seconds` to a 'mm:ss' string.
 *
 * @param {number} seconds
 */
function generateTimerText(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Generate the star rating in a document fragment.
 *
 * 5 stars = < 11 moves
 * 4 stars = < 13 moves
 * 3 stars = < 15 moves
 * 2 stars = < 17 moves
 * 1 star = >= 17 moves
 *
 * @param {number} counter
 *
 * @returns {DocumentFragment} The generated document fragment
 */
function getStarRatingFragment(counter) {
  let rating = 1;

  const fragment = document.createDocumentFragment();
  const starIconFullElm = document.createElement("i");
  const starIconEmptyElm = document.createElement("i");

  starIconFullElm.classList.add("icon-star");
  starIconEmptyElm.classList.add("icon-star-empty");

  if (counter < 11) {
    rating = 5;
  } else if (counter < 13) {
    rating = 4;
  } else if (counter < 15) {
    rating = 3;
  } else if (counter < 17) {
    rating = 2;
  }

  for (let i = 0; i < rating; i++) {
    fragment.appendChild(starIconFullElm.cloneNode(true));
  }

  for (let i = 0; i < 5 - rating; i++) {
    fragment.appendChild(starIconEmptyElm.cloneNode(true));
  }

  return fragment;
}

/**
 * Shows the winning screen.
 *
 * @param {HTMLElement} gameElm
 * @param {HTMLElement} statsElm
 * @param {HTMLElement} wrapperElm
 * @param {HTMLElement} winningScreenElm
 * @param {HTMLElement} timerElm
 * @param {HTMLElement} counterElm
 * @param {HTMLElement} ratingElm
 * @param {number} seconds
 * @param {number} counter
 */
function renderWinningScreen(
  gameElm,
  statsElm,
  wrapperElm,
  winningScreenElm,
  timerElm,
  counterElm,
  ratingElm,
  seconds,
  counter
) {
  gameElm.style.display = "none";
  statsElm.style.display = "none";
  wrapperElm.style.display = "none";

  winningScreenElm.style.display = "flex";

  // set timer text
  updateInnerText(timerElm, generateTimerText(seconds));
  // set counter text
  updateInnerText(counterElm, counter);

  // set star rating
  removeAllChildren(ratingElm);
  ratingElm.appendChild(getStarRatingFragment(counter));

  gameElm.style.display = "block";
}

/**
 * Return the inital values for the stats.
 *
 * @returns {any[]} The initial values
 */
function initializeStats() {
  return [[], 0, 0, null, []];
}
/**
 * Initialize the game.
 *
 * @param {HTMLElement} gameElm
 * @param {HTMLElement} statsElm
 * @param {HTMLElement} wrapperElm
 * @param {HTMLElement} timerElm
 * @param {HTMLElement} counterElm
 * @param {HTMLElement} ratingElm
 * @param {HTMLElement} winningScreenElm
 * @param {HTMLElement} icons
 */
function initializeGame(
  gameElm,
  statsElm,
  wrapperElm,
  timerElm,
  counterElm,
  ratingElm,
  winningScreenElm,
  icons
) {
  const rows = generateRows(icons);
  const fragment = renderRowsInFragment(rows);

  gameElm.style.display = "none";
  winningScreenElm.style.display = "none";

  removeAllChildren(wrapperElm);
  wrapperElm.appendChild(fragment);
  wrapperElm.style.display = "flex";

  updateInnerText(timerElm, generateTimerText(0));

  updateInnerText(counterElm, "0");

  removeAllChildren(ratingElm);
  ratingElm.appendChild(getStarRatingFragment(0));

  statsElm.style.display = "block";
  gameElm.style.display = "block";
}
