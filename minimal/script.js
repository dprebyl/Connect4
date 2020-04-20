const ROWS = 6; // Rows are counted from the bottom up (bottom row = 1)
const COLS = 7;
const WIN_SCORE = 4; // How many in a row to win

const GAME_STATES = {
	"NOT_STARTED": 0,
	"IN_PROGRESS": 1,
	"WON": 2
}
let gameState = GAME_STATES.NOT_STARTED;

// Players are false and true, false is always human and goes first
let curPlayer = false;

// 2D array of the pieces on the board
let chips = [];

// Chip constructor
function Chip(elementIn) {
	let element = elementIn;
	let type = "blank";
	this.getType = function() { 
		return type;
	}
	// Valid types: "blank", false (player0), or true (player1)
	this.setType = function(newType) {
		type = newType;
		element.className = typeof type === "boolean" ? "player" + +type : type;
	}
}

window.addEventListener("DOMContentLoaded", () => {
	setPlayer(false);
	
	// Initialize board and chips array
	let board = document.getElementById("board");
	for (let row = ROWS; row >= 1; row--) {
		let tr = document.createElement("tr");
		chips[row-1] = [];
		for (let col = 1; col <= COLS; col++) {
			let td = document.createElement("td");
			td.className = "blank";
			td.addEventListener("click", () => { clickCol(col); });
			tr.appendChild(td);
			chips[row-1][col-1] = new Chip(td);
		}
		board.appendChild(tr);
	}
});

function clickCol(col) {
	if (gameState == GAME_STATES.WON) return resetGame();
	let row = lowestEmptyRow(col);
	if (row === -1) return msg("Invalid - column full");
	
	setChip(row, col, curPlayer);
	if (checkWin(row, col)) {
		msg("player wins!");
		document.body.classList.add("win");
		gameState = GAME_STATES.WON;
	}
	else {
		// Check if the board is full
		for (let col = 1; col <= COLS; col++) {
			if (lowestEmptyRow(col) !== -1) break;
			else if (col == COLS) {
				msg("Full board - tie game!");
				gameState = GAME_STATES.WON;
				return;
			}
		}
		
		// Switch to other player's turn
		msg("player's turn");
		setPlayer(!curPlayer);
		gameState = GAME_STATES.IN_PROGRESS;
	}
}

function checkWin(row, col) {
	return score(row, col) >= WIN_SCORE;
}

// Returns the largest number of pieces in a row the current player has relative to this space 
// Not guarenteed to be the max possible when return value >= WIN_SCORE
function score(row, col) {
	return Math.max(checkDir(0, 1), checkDir(1, 0), checkDir(1, 1), checkDir(1, -1));

	function checkDir(incRow, incCol) {
		let maxCount = 0;
		let count = 0;
		for (let i = 1-WIN_SCORE; i <= WIN_SCORE-1; i++) {
			if (getChip(row+incRow*i, col+incCol*i) === curPlayer) {
				count++;
				if (count >= maxCount) maxCount = count;
			} else {
				count = 0;
			}
		}
		return maxCount;
	}
}

function resetGame() {
	document.body.classList.remove("win");
	for (let chipRow of chips) for (let chip of chipRow) chip.setType("blank");
	gameState = GAME_STATES.NOT_STARTED;
	setPlayer(false);
	setOpponent(document.getElementById("opponent").value); // In case opponent was changed mid-game
	msg("goes first");
}

function lowestEmptyRow(col) {
	for (let row = 1; row <= ROWS; row++)
		if (getChip(row, col) === "blank") return row;
	return -1; // Column full
}

function getChip(row, col) {
	if (row < 1 || col < 1 || row > ROWS || col > COLS) return undefined;
	return chips[row-1][col-1].getType();
}

function setChip(row, col, type) {
	if (row < 1 || col < 1 || row > ROWS || col > COLS) return;
	chips[row-1][col-1].setType(type);
}

function setPlayer(newPlayer) {
	curPlayer = newPlayer;
	document.getElementById("current-player").className = "player" + +curPlayer;
}

function msg(m) {
	document.getElementById("msg").innerText = m;
}