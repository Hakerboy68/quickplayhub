// Firebase reference
const db = firebase.database();
const gameRef = db.ref("tictactoe");
let currentPlayer = "X";
let board = Array(9).fill("");
let player1Coins = 0;
let player2Coins = 0;
let gameStatus = 'Playing'; // Track current game status
let gameMode = ''; // Track current game mode

const status = document.getElementById("status");
const boardDiv = document.getElementById("board");
const resetButton = document.getElementById("reset");
const cells = [];

// Game Mode Selection
document.getElementById("play-mode-selection").addEventListener("click", function(e) {
  if (e.target.tagName === "BUTTON") {
    document.querySelectorAll("#play-mode-selection button").forEach(button => button.classList.remove("selected"));
    e.target.classList.add("selected");
    gameMode = e.target.id;
    console.log(`Selected Game Mode: ${gameMode}`);
    startGame(gameMode);
});

// Start Game Logic based on selected mode
function startGame(mode) {
  resetGame();
  switch (mode) {
    case 'random':
      status.innerText = "Random Play Mode: Player X's turn.";
      break;
    case 'bot':
      status.innerText = "Bot Play Mode: Player X's turn.";
      break;
    case 'twoPlayer':
      status.innerText = "Two-Player Mode: Player X's turn.";
      break;
    case 'invite':
      status.innerText = "Invite a Friend Mode: Waiting for opponent.";
      break;
    default:
      status.innerText = "Select a game mode.";
  }
}

// Update the board UI
function updateBoardUI() {
  for (let i = 0; i < 9; i++) {
    cells[i].innerText = board[i];
  }
}

// Check for winner
function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winner ('X' or 'O')
    }
  }

  // Draw condition (board full)
  if (!board.includes("")) {
    return "Draw";
  }

  return null; // No winner yet
}

// Handle cell click
function makeMove(index) {
  if (board[index] !== "" || gameStatus !== 'Playing') return;
  
  board[index] = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  
  // Check for winner after each move
  const winner = checkWinner();
  if (winner) {
    gameStatus = 'Ended';
    updateWinnerMessage(winner);
    updateCoins(winner);
    return;
  }

  gameRef.set({ board, currentPlayer });
  handleGameMode();
}

// Show win/loss message
function updateWinnerMessage(winner) {
  if (winner === "Draw") {
    status.innerText = "It's a Draw!";
  } else {
    status.innerText = `${winner} wins!`;
  }
}

// Update coins
function updateCoins(winner) {
  if (winner === "X") {
    player1Coins += 10; // Player 1 earns 10 coins
  } else if (winner === "O") {
    player2Coins += 10; // Player 2 earns 10 coins
  }

  // Save coins to Firebase
  db.ref('players/1').set({ coins: player1Coins });
  db.ref('players/2').set({ coins: player2Coins });
}

// Reset the game
function resetGame() {
  gameStatus = 'Playing';
  board = Array(9).fill("");
  gameRef.set({ board, currentPlayer: "X" });
  status.innerText = "Game reset. Player X's turn.";
}

// Handle game modes
function handleGameMode() {
  if (gameMode === 'bot' && currentPlayer === 'O') {
    setTimeout(botMove, 1000); // Bot makes a move after 1 second
  } else if (gameMode === 'random' && currentPlayer === 'O') {
    setTimeout(randomMove, 1000); // Random player makes a move after 1 second
  }
}

// Bot AI move (simple random move)
function botMove() {
  let availableMoves = board.map((value, index) => value === "" ? index : null).filter(value => value !== null);
  let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  makeMove(randomMove);
}

// Random Player Move
function randomMove() {
  let availableMoves = board.map((value, index) => value === "" ? index : null).filter(value => value !== null);
  let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  makeMove(randomMove);
}

// Firebase listener for real-time updates
gameRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    board = data.board;
    currentPlayer = data.currentPlayer;
    updateBoardUI();

    const winner = checkWinner();
    if (winner) {
      updateWinnerMessage(winner);
      updateCoins(winner);
    } else {
      status.innerText = "Current Player: " + currentPlayer;
    }
  }
});

// Create board cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.dataset.index = i;
  cell.addEventListener("click", () => makeMove(i));
  boardDiv.appendChild(cell);
  cells.push(cell);
}

// Add reset button functionality
resetButton.addEventListener("click", resetGame);

