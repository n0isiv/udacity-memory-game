/**
 * Randomly shuffle the given array using the Fisher-Yates algorithm.
 * https://stackoverflow.com/a/2450976/1293256
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
 * Generates 4 rows with 4 icons each.
 *
 * You must üass in an array with 8 icons.
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
function renderRowsInFragment(rows) {
  const fragment = document.createDocumentFragment();

  rows.forEach(row => {
    const rowElm = document.createElement("div");

    rowElm.classList.add("row");

    row.forEach(card => {
      const cardElm = document.createElement("div");
      const iconElm = document.createElement("i");

      cardElm.classList.add("memory-card");
      iconElm.classList.add(`icon-${card}`, "icon--invisible");
      iconElm.dataset.icon = card;

      cardElm.appendChild(iconElm);
      rowElm.appendChild(cardElm);
    });

    fragment.appendChild(rowElm);
  });

  return fragment;
}

function hideIconElements(...iconElms) {
  iconElms.forEach(iconElm => iconElm.classList.add("icon--invisible"));
}
