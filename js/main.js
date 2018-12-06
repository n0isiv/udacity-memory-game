//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

// the array must allways contain 8 icons
const AVAILABLE_ICONS = [
  "award",
  "leaf",
  "road",
  "umbrella",
  "hammer",
  "truck",
  "flag",
  "coffee"
];

// DOM ELEMENTS
const GAME = document.querySelector(".game");
const WRAPPER = document.querySelector(".wrapper");
const STATS = document.querySelector(".stats");
const TIMER = document.querySelector(".stats__timer");
const COUNTER = document.querySelector(".stats__counter");
const STARRATING = document.querySelector(".stats__rating");
const WINNINGSCREEN = document.querySelector(".winning-screen");
const WINNINGSCREENTIMER = document.querySelector(".winning-screen__timer");
const WINNINGSCREENCOUNTER = document.querySelector(".winning-screen__counter");
const WINNINGSCREENRATING = document.querySelector(".winning-screen__rating");
const RETRY = document.querySelector(".winning-screen__retry");

//
// ─── LOGIC ──────────────────────────────────────────────────────────────────────
//

// STATS
let clickedIcons;
let counter;
let seconds;
let timer;
let matchedIcons;

// set initial stat values and initialize the game (stats + memory cards)
[clickedIcons, counter, seconds, timer, matchedIcons] = initializeStats();
initializeGame(
  GAME,
  STATS,
  WRAPPER,
  TIMER,
  COUNTER,
  STARRATING,
  WINNINGSCREEN,
  AVAILABLE_ICONS
);

//
// ─── GAME LOGIC ─────────────────────────────────────────────────────────────────
//

WRAPPER.addEventListener("click", function(ev) {
  // the clicked icon element
  let iconElm;

  if (ev.target.className === "wrapper__card") {
    // user clicked on a memory card
    iconElm = ev.target.firstChild;
  } else if (ev.target.className.startsWith("icon")) {
    // user clicked the icon
    iconElm = ev.target;
  } else {
    // ignore all other clicks
    return;
  }

  if (timer === null) {
    timer = setInterval(() => {
      seconds += 1;
      text = generateTimerText(seconds);

      updateInnerText(TIMER, text);
    }, 1000);
  }

  // ignore clicks on matched cards
  if (matchedIcons.includes(iconElm.dataset.icon)) {
    return;
  }

  // only allow 2 cards to be visible at the same time
  if (clickedIcons.length === 2) {
    return;
  }

  // make the icon visible
  iconElm.classList.remove("icon--invisible");
  // store the clicked icon
  clickedIcons.push(iconElm);

  // user selected 2 cards, check if they match
  if (clickedIcons.length == 2) {
    if (clickedIcons[0] === clickedIcons[1]) {
      // user clicked the same card twice, revert the second click
      clickedIcons.pop();

      return;
    }

    const iconName1 = clickedIcons[0].dataset.icon;
    const iconName2 = clickedIcons[1].dataset.icon;

    if (iconName1 === iconName2 && clickedIcons[0] !== clickedIcons[1]) {
      // the selected cards match
      matchedIcons.push(iconName1);

      // reset clicked icons
      clickedIcons = [];
    } else {
      // the selected cards do not match

      // wait 750ms before hiding the cards
      setTimeout(() => {
        hideIconElements(...clickedIcons);

        // reset clicked icons
        clickedIcons = [];
      }, 750);
    }

    // update the counter
    counter += 1;
    updateInnerText(COUNTER, counter);

    // update the star rating
    removeAllChildren(STARRATING);
    STARRATING.appendChild(getStarRatingFragment(counter));

    // user has uncovered all card pairs
    if (matchedIcons.length === 8) {
      // stop timer and reset the active state
      clearInterval(timer);
      timer = null;

      // switch to winning screen
      renderWinningScreen(
        GAME,
        STATS,
        WRAPPER,
        WINNINGSCREEN,
        WINNINGSCREENTIMER,
        WINNINGSCREENCOUNTER,
        WINNINGSCREENRATING,
        seconds,
        counter
      );
    }
  }
});

//
// ─── RETRY LOGIC ───────────────────────────────────────────────────────────────
//

RETRY.addEventListener("click", function(ev) {
  // reset stats and switch back to the game
  [clickedIcons, counter, seconds, timer, matchedIcons] = initializeStats();
  initializeGame(
    GAME,
    STATS,
    WRAPPER,
    TIMER,
    COUNTER,
    STARRATING,
    WINNINGSCREEN,
    AVAILABLE_ICONS
  );
});
