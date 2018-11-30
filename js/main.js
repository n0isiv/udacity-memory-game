// -+-----------------------------+-
// CONSTANTS
// -+-----------------------------+-

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
const WRAPPER = document.querySelector(".wrapper");

// -+-----------------------------+-
// LOGIC
// -+-----------------------------+-

let clickedIcons = [];
const matchedIcons = [];
const rows = generateRows(AVAILABLE_ICONS);
const fragment = renderRowsInFragment(rows);

WRAPPER.appendChild(fragment);

WRAPPER.addEventListener("click", function(ev) {
  let iconElm;

  if (ev.target.className === "memory-card") {
    // user clicked on a memory card
    iconElm = ev.target.firstChild;
  } else if (ev.target.className.startsWith("icon")) {
    // user clicked the icon
    iconElm = ev.target;
  } else {
    // ignore all other clicks
    return;
  }

  // ignore clicks on revealed card pairs
  if (matchedIcons.includes(iconElm.dataset.icon)) {
    return;
  }

  // only allow 2 cards to be revealed at the same time
  if (clickedIcons.length === 2) {
    return;
  }

  // make icon visible
  iconElm.classList.remove("icon--invisible");
  // store clicked icon
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
      matchedIcons.push(iconName1);

      // reset clicked icons
      clickedIcons = [];
    } else {
      setTimeout(() => {
        hideIconElements(...clickedIcons);

        // reset clicked icons
        clickedIcons = [];
      }, 750);
    }
  }
});
