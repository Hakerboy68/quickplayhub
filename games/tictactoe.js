const db = firebase.database();
const gameRef = db.ref("tictactoe");
let currentPlayer = "X";

const board = Array(9).fill("");
const cells = [];

const status = document.getElementById("status");
const boardDiv = document.getElementById("board");

for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.dataset.index = i;
  cell.onclick = () => makeMove(i);
  boardDiv.appendChild(cell);
  cells.push(cell);
}

gameRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    for (let i = 0; i < 9; i++) {
      board[i] = data.board[i];
      cells[i].innerText = board[i];
    }
    currentPlayer = data.currentPlayer;
    status.innerText = "Current Player: " + currentPlayer;
  }
});

function makeMove(index) {
  if (board[index] !== "") return;
  board[index] = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameRef.set({ board, currentPlayer });
}
