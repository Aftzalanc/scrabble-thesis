//USE OF MODULES BY IMPORTING THE TILE BAG CLASS FROM sakouli.js
// Import the Greek letter bag class
import sakouli from "./sakouli.js";

// Initialize the tile bag
const sak = new sakouli();

// === Board setup ===

const premiumSquares = [
  "triple-word",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "triple-word",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "triple-word",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "triple-word",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "star",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "triple-word",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "triple-letter",
  "tile",
  "tile",
  "tile",
  "double-word",
  "tile",
  "triple-word",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "tile",
  "triple-word",
  "tile",
  "tile",
  "tile",
  "double-letter",
  "tile",
  "tile",
  "triple-word",
];

// DOM references
const board = document.getElementById("board");
const rack = document.getElementById("rack"); // Player 1's rack
const rackTop = document.getElementById("rack-top"); // Player 2's rack
let activeRack = "bottom"; // or "top"                // Tracks current player's rack
let turnNumber = 1; // Tracks turn count
let player1Score = 0;
let player2Score = 0;
let player1Scrabbles = 0;
let player2Scrabbles = 0;
let scrabbleBonus = 0;

// === TIMER SETUP ===
// Each player starts with 30 minutes (1800 seconds)
let player1Time = 30 * 60; // 30 minutes in seconds
let player2Time = 30 * 60;
// We will use this to control the countdown interval
let timerInterval;

// === Penalties ===
// Track penalties separately for time and for leftover rack letters
let player1PenaltyTime = 0;
let player2PenaltyTime = 0;
let player1PenaltyLetters = 0;
let player2PenaltyLetters = 0;

// Stores currently placed letters with their board index and original rack index
// Letters placed on board (but not yet confirmed)
const placedLetters = [];

// Array to save confirmed/successful words
// Saved, confirmed words
const savedWords = [];

//ARRAY FOR SPECIAL TILES VALUES
// Create an array of integers corresponding to the 225 cells
// Mapping: double-word & star = 4, double-letter = 2, triple-letter = 3, triple-word = 6, everything else = 1
// Translate premiumSquares to numerical values for scoring
const premiumValues = premiumSquares.map((type) => {
  switch (type) {
    case "double-word":
    case "star":
      return 4;
    case "double-letter":
      return 2;
    case "triple-letter":
      return 3;
    case "triple-word":
      return 6;
    default:
      return 1; // 1 to represent no special effect
  }
});

//ARRAY TO KEEP TRACK OF THE INDEX OF LETTERS OF THE CURRENT WORD
// Track cell indices of current word (for scoring)
let Lindex = []; //letter index for the letters of the current word

//TIMER METHODS
// Formats seconds into MM:SS string format (e.g. "29:59")
function formatTime(seconds) {
  const negative = seconds < 0;
  const absSec = Math.abs(seconds);
  const m = String(Math.floor(absSec / 60)).padStart(2, "0");
  const s = String(absSec % 60).padStart(2, "0");
  return (negative ? "-" : "") + `${m}:${s}`;
}

// Update both timers on the screen every second
function updateTimersOnScreen() {
  document.getElementById("timer-p1").textContent = formatTime(player1Time);
  document.getElementById("timer-p2").textContent = formatTime(player2Time);
}

// Start or restart the countdown for the active player
function startTimer() {
  // Stop any previous timer
  clearInterval(timerInterval);

  // Start a new timer that ticks every 1 second
  timerInterval = setInterval(() => {
    // Check which player's turn it is
    // Select active player's time variable
    if (activeRack === "bottom") {
      player1Time--;

      //If the time hits -5 minutes (-300 seconds), the game ends
      if (player1Time <= -300) {
        // -5 minutes
        clearInterval(timerInterval);
        alert("TIME IS UP for Player 1");
        endGame("Player 1", "time");
      }
    } else {
      player2Time--;

      if (player2Time <= -300) {
        // -5 minutes
        clearInterval(timerInterval);
        alert("TIME IS UP for Player 2");
        endGame("Player 2", "time");
      }
    }

    // Update the visible timers
    updateTimersOnScreen();
  }, 1000);
}

// Called when time runs out
function endGame(losingPlayer, reason = "") {
  clearInterval(timerInterval); // Stop the timer

  document.getElementById("checkWords").disabled = true;
  document.getElementById("rearrangeBtn").disabled = true;
  document.getElementById("changeLettersBtn").disabled = true;

  let message = "<p>The game has ended.</p>";

  // === TIME PENALTY ===
  // Calculate MIN and apply penalty
  if (reason === "time") {
    let penaltyPoints = 0;
    if (losingPlayer === "Player 1") {
      const MIN = Math.ceil(Math.abs(player1Time) / 60);
      penaltyPoints = MIN * 10;
      player1Penalty = penaltyPoints;
      player1Score -= penaltyPoints;
    } else if (losingPlayer === "Player 2") {
      const MIN = Math.ceil(Math.abs(player2Time) / 60);
      penaltyPoints = MIN * 10;
      player2Penalty = penaltyPoints;
      player2Score -= penaltyPoints;
    }
    message += `<p>${losingPlayer}'s time is up. Time penalty: -${penaltyPoints} points</p>`;
  }

  // === FINAL LETTERS PENALTY ===
  if (reason === "letters") {
    const p1Rack = rack.children.length;
    const p2Rack = rackTop.children.length;
    let letterScore = 0;
    let winner = "";

    // Determine who finished all their letters and calculate penalties
    if (p1Rack === 0) {
      letterScore = calculateRackScore(rackTop);
      player1Score += letterScore;
      player2Score -= letterScore;
      player2PenaltyLetters = letterScore;
      winner = "Player 1";
    } else if (p2Rack === 0) {
      letterScore = calculateRackScore(rack);
      player2Score += letterScore;
      player1Score -= letterScore;
      player1PenaltyLetters = letterScore;
      winner = "Player 2";
    }

    // Build message
    message += `<p>${winner} used all their letters and ended the game.</p>`;
    message += `<p>Remaining rack score from opponent: +${letterScore} points to ${winner}, -${letterScore} points to opponent.</p>`;
    message += `<p><strong>${winner} wins!</strong></p>`;
  }
  updateScoreDisplay(); // Show the new (penalized) scores

  // === SHOW MESSAGE BOX ===
  // Create a full-screen overlay message
  const overlay = document.createElement("div");
  overlay.id = "endOverlay";
  overlay.innerHTML = `
    <div class="endMessageBox">
      ${message}
      <p class="dismissHint">(Click anywhere to dismiss)</p>
    </div>
  `;
  // Add a click listener to remove the overlay when user clicks anywhere
  overlay.addEventListener("click", () => {
    overlay.remove();
  });

  // Add to the document
  document.body.appendChild(overlay);
}

//end of timer methods

//penalty leftover letters method
// Calculates total point value of all letters left on a rack using sak.getPoints()
function calculateRackScore(rackElement) {
  let letters = "";
  // Go through each tile in the rack and collect its letter
  for (const tile of rackElement.children) {
    letters += tile.textContent;
  }
  // Use sak's built-in method to get total score
  return sak.getPoints(letters);
}

//end letter penalty

/// Rearrange rack tiles randomly
document.getElementById("rearrangeBtn").addEventListener("click", () => {
  const currentRack = getActiveRackElement();
  const tiles = Array.from(currentRack.children);
  const shuffled = tiles.sort(() => Math.random() - 0.5);
  currentRack.innerHTML = "";
  shuffled.forEach((tile) => currentRack.appendChild(tile));
});

/// Change selected letters
document.getElementById("changeLettersBtn").addEventListener("click", () => {
  // STEP 0: Check tile bag before doing anything
  if (sak.totalAmountOfLetters <= 7) {
    alert(
      "You can't change letters now — there are 7 or fewer letters left in the bag."
    );
    return; // stop the function early
  }

  // STEP 1: Get the current player's rack (top or bottom)
  //const rackTiles = Array.from(rack.children);
  const currentRack = getActiveRackElement();
  const rackTiles = Array.from(currentRack.children);

  // STEP 2: Check if the rack is empty — can't change if no tiles
  if (rackTiles.length === 0) {
    alert("No letters in rack to change.");
    return;
  }

  // STEP 3: Show the letters and ask which ones to change
  const currentLetters = rackTiles.map((tile) => tile.textContent).join("");
  const toChange = prompt(
    "Your letters: " +
      currentLetters +
      "\\nEnter the letters you want to change (no spaces):"
  );

  if (!toChange) return; // If they cancel, do nothing

  const lettersToChange = toChange.toUpperCase().split("");
  const newRack = [];

  // STEP 4: Clear the current rack on the screen
  currentRack.innerHTML = ""; // clear rack for now

  // STEP 5: Go through each tile, replace if needed
  rackTiles.forEach((tile) => {
    const char = tile.textContent.toUpperCase();

    if (lettersToChange.includes(char)) {
      const newLetter = sak.putLetter(char); // return letter to bag and get new

      const newTile = document.createElement("div");

      newTile.classList.add("letter");
      newTile.textContent = newLetter;
      newTile.draggable = true;
      newTile.dataset.originalIndex = newRack.length;
      newTile.addEventListener("dragstart", dragStart);
      newRack.push(newTile);

      // Remove the used letter
      lettersToChange.splice(lettersToChange.indexOf(char), 1);
    } else {
      // Keep original tile
      newRack.push(tile);
    }
  });

  // STEP 6: Put all tiles back into the rack
  newRack.forEach((tile) => {
    tile.dataset.originalIndex = currentRack.children.length;
    currentRack.appendChild(tile);
  });

  // === STEP 7: SKIP TURN ===
  // === Skip turn logic for Change Letters ===
  alert(
    "You changed your letters. You score 0 points this round. Turn passes to the next player."
  );

  // Refill any missing letters (for example if player only changed 3)
  refillRack(getActiveRackElement()); // Fill up new letters if some were removed
  // Don't add any points — no need to change score
  updateScoreDisplay(); // Show unchanged score
  toggleActiveRack(); // Move to the next player's turn
});

function refillRack(targetRack) {
  while (targetRack.children.length < 7) {
    const letter = sak.getLetter(1);
    const tile = document.createElement("div");
    tile.classList.add("letter");
    tile.textContent = letter;
    tile.draggable = true;
    tile.dataset.originalIndex = targetRack.children.length;
    tile.addEventListener("dragstart", dragStart);
    targetRack.appendChild(tile);
  }
}

function toggleActiveRack() {
  if (activeRack === "bottom") {
    rack.classList.add("covered"); // Hide Player 1's rack
    rackTop.classList.remove("covered"); // Show Player 2's rack
    activeRack = "top";
  } else {
    rackTop.classList.add("covered"); // Hide Player 2's rack
    rack.classList.remove("covered"); // Show Player 1's rack
    activeRack = "bottom";
  }
  turnNumber++;
  updateTurnIndicator(); // Reflect change in UI

  // Start the countdown for the next player's turn
  startTimer();
}

function getActiveRackElement() {
  return activeRack === "bottom" ? rack : rackTop;
}

function updateTurnIndicator() {
  const turnLabel = document.getElementById("turnIndicator");
  const currentPlayer = activeRack === "bottom" ? "Player 1" : "Player 2";
  turnLabel.textContent = `Turn: ${currentPlayer}`;
}

function updateScoreDisplay() {
  document.getElementById("score-p1").textContent = player1Score;
  document.getElementById("score-p2").textContent = player2Score;

  document.getElementById("scrabbles-p1").textContent = player1Scrabbles;
  document.getElementById("scrabbles-p2").textContent = player2Scrabbles;

  // Show penalties
  document.getElementById("penalty-time-p1").textContent = player1PenaltyTime;
  document.getElementById("penalty-time-p2").textContent = player2PenaltyTime;

  document.getElementById("penalty-letters-p1").textContent =
    player1PenaltyLetters;
  document.getElementById("penalty-letters-p2").textContent =
    player2PenaltyLetters;
}

// === Create 15x15 Scrabble board ===
function createBoard() {
  for (let i = 0; i < 225; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    // Style premium tiles differently
    if (premiumSquares[i] !== "tile") {
      cell.classList.add(premiumSquares[i]);
    }

    cell.addEventListener("dragover", (e) => e.preventDefault());
    cell.addEventListener("drop", (e) => dropLetter(e, cell));

    // Assign index for future reference
    cell.dataset.index = i;
    board.appendChild(cell);
  }
}

function fillLetterValueTable() {
  const tbody = document.querySelector("#letterTable tbody");

  for (let i = 0; i < sak.letter.length; i++) {
    const row = document.createElement("tr");

    const letterCell = document.createElement("td");
    letterCell.textContent = sak.letter[i];

    const pointCell = document.createElement("td");
    pointCell.textContent = sak.value[i];

    row.appendChild(letterCell);
    row.appendChild(pointCell);
    tbody.appendChild(row);
  }
}

function createRack(targetRack, letters) {
  targetRack.innerHTML = "";
  targetRack.addEventListener("dragover", (e) => e.preventDefault());
  targetRack.addEventListener("drop", (e) => dropBackToRack(e, targetRack));

  letters.forEach((letter, index) => {
    const tile = document.createElement("div");
    tile.classList.add("letter");
    tile.textContent = letter;
    tile.draggable = true;
    tile.dataset.originalIndex = index;
    tile.addEventListener("dragstart", dragStart);
    targetRack.appendChild(tile);
  });
}

function dropBackToRack(e, targetRack) {
  e.preventDefault();
  const letter = e.dataTransfer.getData("text");
  const source = e.dataTransfer.getData("source");
  const originalIndex = parseInt(e.dataTransfer.getData("originalIndex"));
  const draggedEl = document.querySelector(".being-dragged");

  if (source === "board") {
    const cells = document.querySelectorAll(".cell");
    for (const cell of cells) {
      if (cell.textContent === letter && !cell.classList.contains("locked")) {
        cell.textContent = "";
        cell.classList.remove("letter");
        const idx = placedLetters.findIndex(
          (p) => p.index == cell.dataset.index
        );
        if (idx !== -1) placedLetters.splice(idx, 1);
        break;
      }
    }
  } else if (draggedEl) {
    draggedEl.remove();
  }

  const tile = document.createElement("div");
  tile.classList.add("letter");
  tile.textContent = letter;
  tile.draggable = true;
  tile.dataset.originalIndex = originalIndex;
  tile.addEventListener("dragstart", dragStart);

  targetRack.appendChild(tile);

  document
    .querySelectorAll(".being-dragged")
    .forEach((el) => el.classList.remove("being-dragged"));
}

// === Drag handling: Start dragging a tile ===
function dragStart(e) {
  e.dataTransfer.setData("text", e.target.textContent); // letter
  e.dataTransfer.setData("originalIndex", e.target.dataset.originalIndex || ""); // track rack position
  e.dataTransfer.setData("source", e.target.parentElement.id); // source // 'rack', 'rack-top' or 'board'
  e.target.classList.add("being-dragged"); // mark for cleanup later
}

// === Allow board cells to accept drops ===
board.addEventListener("dragover", (e) => e.preventDefault());

// === Drop tile on board ===
board.addEventListener("drop", (e) => {
  e.preventDefault();
  // Read drag data
  const letter = e.dataTransfer.getData("text");
  const source = e.dataTransfer.getData("source");
  const originalIndex = e.dataTransfer.getData("originalIndex");
  const draggedEl = document.querySelector(".being-dragged");

  // Only drop if it's an empty board cell
  if (!e.target.classList.contains("cell") || e.target.textContent.trim())
    return;

  // === Make this board cell behave like a tile ===
  e.target.textContent = letter;
  e.target.classList.add("letter");

  // ENABLE dragging again
  e.target.draggable = true;
  e.target.dataset.originalIndex = originalIndex;
  e.target.addEventListener("dragstart", dragStart); // ← CRITICAL: reattach dragStart

  // Cleanup source // Remove tile from rack if it came from there
  //if (source === "rack" && draggedEl) {
  if ((source === "rack" || source === "rack-top") && draggedEl) {
    draggedEl.remove(); // Remove it from rack
  } else if (source === "board") {
    draggedEl.textContent = "";
    draggedEl.classList.remove("letter");
    draggedEl.draggable = false; // Temporarily disable until reset
  }

  // Update tracking of placed letters // Track placed letter, board index and rack position
  const boardIndex = parseInt(e.target.dataset.index);
  const existing = placedLetters.findIndex((p) => p.index === boardIndex);
  if (existing >= 0)
    placedLetters[existing] = {
      letter,
      index: boardIndex,
      originalIndex: parseInt(originalIndex),
    };
  else
    placedLetters.push({
      letter,
      index: boardIndex,
      originalIndex: parseInt(originalIndex),
    });

  // Cleanup dragging class
  document
    .querySelectorAll(".being-dragged")
    .forEach((el) => el.classList.remove("being-dragged"));
});

// === Allow rack to accept dragged tiles ===
rack.addEventListener("dragover", (e) => e.preventDefault());

// === Utility: Get a word starting from a cell in a direction ===
function getWordFrom(startIndex, direction) {
  const delta = direction === "horizontal" ? 1 : 15;
  let word = "";
  let currentIndex = startIndex;

  // Move to the beginning of the word // Go backwards to the start of the word
  while (
    currentIndex >= 0 &&
    document.querySelector(`.cell[data-index="${currentIndex - delta}"]`)
      ?.textContent
  ) {
    currentIndex -= delta;
  }

  const indices = [];
  // Collect letters moving forward // Read forward until no more letters
  while (
    currentIndex < 225 &&
    document.querySelector(`.cell[data-index="${currentIndex}"]`)?.textContent
  ) {
    word += document.querySelector(
      `.cell[data-index="${currentIndex}"]`
    ).textContent;
    indices.push(currentIndex);

    //array to keep everything
    Lindex.indexOf(currentIndex) === -1
      ? Lindex.push(currentIndex)
      : console.log("This item already exists");

    currentIndex += delta;
  }

  return word.length > 1 ? word : null;
}

// === Ask PHP if words are valid ===
async function validateWords(words) {
  const res = await fetch("validate_words.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ words }),
  });
  const data = await res.json();
  return data.validWords || [];
}

// === CHECK Button Logic ===
//php connection and word check
document.getElementById("checkWords").addEventListener("click", async () => {
  // Mark all tiles on the board as locked in place
  placedLetters.forEach(({ index }) => {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell) cell.classList.add("locked");
  });

  // Lock the placed tiles from further interaction
  placedLetters.forEach(({ index }) => {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell) {
      cell.draggable = false; // prevent dragging again
      cell.style.pointerEvents = "none"; // disable all pointer interaction
    }
  });

  if (placedLetters.length === 0) {
    alert("No letters placed on the board.");
    return;
  }

  const formedWords = [];
  const seenHorizontal = new Set();
  const seenVertical = new Set();
  const invalidLetters = new Set();
  const wordScores = [];
  const boardIndices = placedLetters.map((p) => p.index);

  if (savedWords.length === 0 && !boardIndices.includes(112)) {
    alert("First word must pass through the center cell.");
    returnTilesToRack();
    return;
  }

  const sameRow = boardIndices.every(
    (i) => Math.floor(i / 15) === Math.floor(boardIndices[0] / 15)
  );
  const sameCol = boardIndices.every((i) => i % 15 === boardIndices[0] % 15);

  if (!sameRow && !sameCol) {
    alert("All placed letters must be aligned in a single straight line.");
    returnTilesToRack();
    return;
  }

  if (savedWords.length > 0) {
    const hasConnection = placedLetters.some(({ index }) => {
      const neighbors = [index - 1, index + 1, index - 15, index + 15];
      return neighbors.some((neighborIndex) => {
        const cell = document.querySelector(
          `.cell[data-index="${neighborIndex}"]`
        );
        if (!cell) return false;
        const isNew = placedLetters.some((p) => p.index === neighborIndex);
        return cell.textContent && !isNew;
      });
    });

    if (!hasConnection) {
      alert("New word must connect to existing letters.");
      returnTilesToRack();
      return;
    }
  }

  placedLetters.forEach(({ index }) => {
    const horizontal = getWordFrom(index, "horizontal");
    const vertical = getWordFrom(index, "vertical");

    if (
      horizontal &&
      horizontal.length > 1 &&
      !seenHorizontal.has(horizontal)
    ) {
      formedWords.push(horizontal);
      seenHorizontal.add(horizontal);
    }

    if (vertical && vertical.length > 1 && !seenVertical.has(vertical)) {
      formedWords.push(vertical);
      seenVertical.add(vertical);
    }
  });

  const validWords = await validateWords(formedWords);
  const invalids = formedWords.filter((w) => !validWords.includes(w));

  if (invalids.length > 0 || formedWords.length === 0) {
    alert("Invalid words: " + invalids.join(", "));
    returnTilesToRack();
    return;
  }

  console.log("Words formed this round:", formedWords);
  alert("Words formed this round:\n" + formedWords.join(", "));

  if (invalidLetters.size > 0 || formedWords.length === 0) {
    alert("Invalid or no valid words formed. Move cancelled.");
    returnTilesToRack();
    return;
  }

  const usedPremiumIndices = new Set();

  formedWords.forEach((word) => {
    let points = 0;
    let wordMultiplier = 1;
    let indices = [];

    // Find word start on board
    for (let i = 0; i < 225; i++) {
      const cell = document.querySelector(`.cell[data-index="${i}"]`);
      if (!cell || cell.textContent !== word[0]) continue;

      let hCandidate = "";
      let hIndices = [];
      for (let j = 0; j < word.length && i + j < 225; j++) {
        const c = document.querySelector(`.cell[data-index="${i + j}"]`);
        if (!c || !c.textContent) break;
        hCandidate += c.textContent;
        hIndices.push(i + j);
      }

      if (hCandidate === word) {
        indices = hIndices;
        break;
      }

      // Try vertical
      hCandidate = "";
      hIndices = [];
      for (let j = 0; j < word.length && i + j * 15 < 225; j++) {
        const c = document.querySelector(`.cell[data-index="${i + j * 15}"]`);
        if (!c || !c.textContent) break;
        hCandidate += c.textContent;
        hIndices.push(i + j * 15);
      }

      if (hCandidate === word) {
        indices = hIndices;
        break;
      }
    }

    // Calculate word score
    for (let i = 0; i < word.length; i++) {
      const letterChar = word[i];
      const index = indices[i];

      for (let j = 0; j <= 24; j++) {
        if (letterChar == sak.letter[j]) {
          const premium = premiumValues[index] || 1;

          switch (premium) {
            case 1:
              points += sak.value[j];
              break;
            case 2:
              points += sak.value[j] * 2;
              break;
            case 3:
              points += sak.value[j] * 3;
              break;
            case 4:
              points += sak.value[j];
              wordMultiplier *= 2;
              break;
            case 6:
              points += sak.value[j];
              wordMultiplier *= 3;
              break;
          }

          usedPremiumIndices.add(index);
        }
      }
    }

    const wordPoints = points * wordMultiplier;
    wordScores.push({ word, points: wordPoints });
    savedWords.push(word);
  });

  usedPremiumIndices.forEach((index) => {
    premiumValues[index] = 1;
  });

  //SCRABBLE
  const usedAllSeven = placedLetters.length === 7;

  if (usedAllSeven) {
    scrabbleBonus = 50; // Add the bonus points

    if (activeRack === "bottom") {
      player1Scrabbles++;
    } else {
      player2Scrabbles++;
    }

    alert("🎉 CONGRATULATIONS! SCRABBLE = YOU GET A 50-POINT BONUS!");
  }

  const totalScore =
    wordScores.reduce((sum, w) => sum + w.points, 0) + scrabbleBonus;

  console.log("Word scores:", wordScores);
  console.log("Total round score:", totalScore);
  alert(
    wordScores.map((w) => `${w.word}: ${w.points} pts`).join("\n") +
      `\n\nTotal score this round: ${totalScore} pts`
  );

  if (activeRack === "bottom") {
    player1Score += totalScore;
  } else {
    player2Score += totalScore;
  }
  updateScoreDisplay();

  // Check if the tile bag is empty AND this player emptied their rack
  if (sak.totalAmountOfLetters === 0) {
    if (activeRack === "bottom" && rack.children.length === 0) {
      endGame("Player 1", "letters");
      return; // stop further processing
    }
    if (activeRack === "top" && rackTop.children.length === 0) {
      endGame("Player 2", "letters");
      return;
    }
  }

  placedLetters.length = 0;
  Lindex.length = 0;

  refillRack(getActiveRackElement()); // works for either player's rack
  toggleActiveRack();

  // This function is called when a move is invalid (e.g., misplaced letters or invalid words).
  // It returns all currently placed letters (this turn) back to the player’s rack and clears the board.
  function returnTilesToRack() {
    // Get the active player's rack element (either Player 1 or Player 2)
    const targetRack = getActiveRackElement();

    // Track which rack positions have already been used (to avoid duplicates)
    const usedIndices = new Set();

    // Only reset non-locked cells and recreate correct rack tiles
    // Loop over all letters that were placed on the board during this turn
    placedLetters.forEach(({ letter, index, originalIndex }) => {
      // Locate the cell on the board by its index
      const cell = document.querySelector(`.cell[data-index="${index}"]`);

      // Always clear cell (even if locked) since word was invalid
      // If the cell exists, we clear it completely — even if it was mistakenly locked
      if (cell) {
        cell.textContent = ""; // Remove the letter from the board
        cell.classList.remove("locked"); // Remove any locking class (from previous valid placement)
        cell.classList.remove("letter"); // Remove the visual tile appearance
        cell.draggable = false; // Prevent it from being dragged again
        cell.style.pointerEvents = "auto"; // Allow it to be used again in future moves
      }

      // Avoid adding duplicate tiles in rack
      // Check if this rack position has already been filled to prevent duplicates
      if (!usedIndices.has(originalIndex)) {
        usedIndices.add(originalIndex); // Mark this rack index as used

        // Create a new tile element to return the letter to the rack
        const tile = document.createElement("div");
        tile.classList.add("letter"); // Styling for rack tiles
        tile.textContent = letter; // Restore the correct letter
        tile.draggable = true; // Enable dragging
        tile.dataset.originalIndex = originalIndex; // Track its original position
        tile.addEventListener("dragstart", dragStart); // Attach drag behavior

        // Place it back in the rack at its original position if space allows
        if (originalIndex < targetRack.children.length) {
          targetRack.insertBefore(tile, targetRack.children[originalIndex]);
        } else {
          // Otherwise, just append it to the end
          targetRack.appendChild(tile);
        }
      }

      // Restore interaction for adjacent cells
      // Reactivate the cell above this one (useful for vertical alignment)
      // Helps avoid interaction bugs if player wants to move pieces upward
      const aboveIndex = index - 15;
      if (aboveIndex >= 0) {
        const aboveCell = document.querySelector(
          `.cell[data-index="${aboveIndex}"]`
        );
        if (aboveCell) aboveCell.style.pointerEvents = "auto"; // Enable interactions
      }
    });

    // Clear tracking arrays to reset the board state for the next move
    placedLetters.length = 0; // No more letters on board this turn
    invalidLetters.clear(); // Remove any flags about bad placements
    Lindex.length = 0; // Clear index tracking for scoring
  }
});

// === Initial render ===
createBoard();
fillLetterValueTable();

// Set up the two racks with starting letters
let letters1 = sak.getLetter(7);
let letters2 = sak.getLetter(7);
createRack(rack, letters1);
createRack(rackTop, letters2);
updateTurnIndicator(); // Show "Turn: Player 1" initially
rackTop.classList.add("covered"); // Only bottom rack visible at start  // Hide Player 2 initially
updateScoreDisplay();

startTimer(); // Begin countdown for Player 1
