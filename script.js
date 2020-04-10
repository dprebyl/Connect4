const ROWS = 6; // Rows are counted from the bottom up (bottom row = 1)
const COLS = 7;
const WIN_SCORE = 4; // How many in a row to win

// Minimum time in ms
const AI_THINK_TIME = 600;

// Creates dropdowns in the option box
const SETTINGS = [
	{
		"id": "theme",
		"name": "Theme",
		"changeCallback": setTheme,
		"options": {"ku": "KU", "traditional": "Traditional"}
	}, {
		"id": "opponent",
		"name": "Opponent",
		"changeCallback": setOpponent,
		"options": {"easyAI": "Easy AI", /*"hardAI": "Hard AI",*/ "human": "Human"}
	}
];

const GAME_STATES = {
	"NOT_STARTED": 0,
	"IN_PROGRESS": 1,
	"WON": 2
}
let gameState = GAME_STATES.NOT_STARTED;

// Players are false and true, false is always human and goes first
let curPlayer = false;

// Set to a function when playing against AI
let aiMoveFunc = easyAIMove;

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
			let chip = document.createElement("button");
			chip.className = "chip";
			chip.addEventListener("click", () => { clickCol(col); });
			td.appendChild(chip);
			tr.appendChild(td);
			chips[row-1][col-1] = new Chip(td);
		}
		board.appendChild(tr);
	}

	// Initialize settings
	let settingsDiv = document.getElementById("settings");
	for (let setting of SETTINGS) {
		settingsDiv.appendChild(document.createTextNode(setting.name + ": "));
		let dropdown = document.createElement("select");
		dropdown.id = setting.id;
		dropdown.addEventListener("change", () => {
			localStorage.setItem(setting.id, dropdown.value);
			setting.changeCallback(dropdown.value)
		});
		for (let optionId in setting.options) {
			let option = document.createElement("option");
			option.value = optionId;
			option.innerText = setting.options[optionId];
			if (localStorage.getItem(setting.id) === option.value) {
				option.selected = "selected";
				setting.changeCallback(option.value);
			}
			dropdown.appendChild(option);
		}
		settingsDiv.appendChild(dropdown);
		settingsDiv.appendChild(document.createElement("br"));
	}
});

// Number key shortcuts for placing pieces in columns
document.addEventListener("keydown", e => {
	let keyNum = parseInt(e.key);
	if (keyNum >= 1 && keyNum <= COLS) clickCol(keyNum);
});

function setTheme(theme) {
	document.getElementById("theme").href = "theme-" + theme + "/style.css";
}

function setOpponent(opponentId) {
	if (gameState === GAME_STATES.IN_PROGRESS) 
		return msg("New opponent next game");
	
	// Function name in the format of opponentId + "Move", ex: "easyAIMove"
	aiMoveFunc = (opponentId == "human" ? null : window[opponentId + "Move"]);
}

function clickCol(col) {
	// Disable clicking while AI thinking
	if (aiMoveFunc === null || !curPlayer || gameState === GAME_STATES.WON) placeMove(col);
}

function placeMove(col) {
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
		if (aiMoveFunc === null || curPlayer) { 
			msg("player's turn");
			setPlayer(!curPlayer);
			gameState = GAME_STATES.IN_PROGRESS;
		}
		else { // Start AI's move
			msg("AI thinking...");
			setPlayer(!curPlayer);
			setTimeout(aiMoveFunc, AI_THINK_TIME);
		}
	}
}

/*
	The easy AI's strategy is as follows:
	- If the AI can win it will
	- Next, if there is somewhere it can go that directly prevents the opponent from winning next turn it will go there
	- Next, it will go in a space that creates the longest row of its own pieces.
	- If multiple places yield are equally good it picks a random one.
	- It will not pick a place that allows the opponent to win next turn, unless doing so lets it win.
	- To beat the AI, create two ways for you to get win in the next turn.
*/
function easyAIMove() {
	let colScores = [];
	for (let col = 1; col <= COLS; col++) {
		colScores[col] = 0;
		
		let row = lowestEmptyRow(col);
		if (row === -1) { // Skip full columns
			colScores[col] = -1;
			continue; 
		}
		
		// Check if the human would win by placing their piece here next turn - block them if AI can't win this turn
		if (canPlayer0Win(row, col)) colScores[col] = WIN_SCORE - 0.5;
		
		// Test how good placing in this column would be
		setChip(row, col, curPlayer);
		colScores[col] = Math.max(colScores[col], score(row, col));
		// Check if the AI placing here would allow the human to win next turn by placing on top of it
		if (row < ROWS && canPlayer0Win(row+1, col) && colScores[col] < WIN_SCORE)
			colScores[col] = 0; // Only go here if it's the only valid move
		setChip(row, col, "blank");
	}
	
	// Click in a random column with the best score
	let bestScore = Math.max(...colScores.slice(1));
	let possibleMoves = [];
	for (let col = 1; col <= COLS; col++)
		if (colScores[col] === bestScore) possibleMoves.push(col);
	placeMove(possibleMoves[Math.floor(Math.random()*possibleMoves.length)]);
	
	// See if the human player can win in this space
	function canPlayer0Win(row, col) {
		curPlayer = !curPlayer;
		setChip(row, col, curPlayer);
		let wouldWin = checkWin(row, col);
		curPlayer = !curPlayer;
		setChip(row, col, "blank");
		return wouldWin;
	}
}

// My orignial plan was to do min-max but I'm not sure that's a reasonable amount of computation
function hardAIMove() {
	msg("NYI");
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