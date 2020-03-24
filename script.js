// Rows are counted from the bottom up (bottom row = 1)
const ROWS = 6;
const COLS = 7;

// Creates dropdowns in the option box
const SETTINGS = [
	{
		"id": "theme",
		"name": "Theme",
		"changeCallback": setTheme,
		"options": ["KU", "Traditional"]
	}, {
		"id": "opponent",
		"name": "Opponent",
		"changeCallback": setOpponent,
		"options": ["Human", "Easy AI", "Hard AI"]
	}
];

// Players are 0 and 1 (false and true)
let curPlayer = false;

const GAME_STATES = {
	"NOT_STARTED": 0,
	"IN_PROGRESS": 1,
	"WON": 2
}
let gameState = GAME_STATES.NOT_STARTED;

window.addEventListener("DOMContentLoaded", () => {
	setPlayer(false);
	
	// Initialize board
	let board = document.getElementById("board");
	for (let row = ROWS; row >= 1; row--) {
		let tr = document.createElement("tr");
		for (let col = 1; col <= COLS; col++) {
			let td = document.createElement("td");
			td.className = "blank";
			let chip = document.createElement("button");
			chip.className = "chip";
			chip.addEventListener("click", () => { clickCol(col); });
			td.appendChild(chip);
			tr.appendChild(td);
		}
		board.appendChild(tr);
	}

	var settingsDiv = document.getElementById("settings");
	for (let setting of SETTINGS) {
		settingsDiv.appendChild(document.createTextNode(setting.name + ": "));
		let dropdown = document.createElement("select");
		dropdown.addEventListener("change", () => {
			localStorage.setItem(setting.id, dropdown.value);
			setting.changeCallback(dropdown.value)
		});
		for (let optionName of setting.options) {
			let option = document.createElement("option");
			// Replace all non-alphanumeric characters with _
			option.value = optionName.toLowerCase().replace(/[^a-z0-9]/g,'_');
			option.innerText = optionName;
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

function setTheme(theme) {
	document.getElementById("theme").href = "theme-" + theme + "/style.css";
}

function setOpponent(opponent) {
	if (gameState === GAME_STATES.IN_PROGRESS) 
		return msg("New opponent next game");
}

function clickCol(col) {
	if (gameState == GAME_STATES.WON) return resetGame();
	// Find the lowest empty space in the column clicked
	for (let row = 1; row <= ROWS; row++) {
		if (getChip(row, col) === "blank") {
			setChip(row, col, curPlayerClass());
			if (checkWin(row, col)) {
				msg("player wins!");
				gameState = GAME_STATES.WON;
			}
			else {
				msg("player's turn");
				setPlayer(!curPlayer);
				gameState = GAME_STATES.IN_PROGRESS;
			}
			return;
		}
	}
	msg("Invalid - column full");
}

function checkWin(row, col) {
	return checkDir(0, 1) || checkDir(1, 0) || checkDir(1, 1) || checkDir(1, -1);

	function checkDir(incRow, incCol) {
		var count = 0;
		for (var i = -3; i <= 3; i++) {
			if (getChip(row+incRow*i, col+incCol*i) === curPlayerClass()) {
				count++;
				if (count >= 4) return true;
			} else {
				count = 0;
			}
		}
		return false;
	}
}

function resetGame() {
	let chips = document.querySelectorAll("#board td");
	for (let chip of chips) chip.className = "blank";
	gameState = GAME_STATES.NOT_STARTED;
	curPlayer = false;
	msg("goes first");
}

function getChip(row, col) {
	if (row < 1 || col < 1 || row > ROWS || col > COLS) return undefined;
	return document.querySelector("#board tr:nth-child(" + (ROWS-row+1) + ") td:nth-child(" + col + ")").className;
}

function setChip(row, col, type) {
	document.querySelector("#board tr:nth-child(" + (ROWS-row+1) + ") td:nth-child(" + col + ")").className = type;
}

function curPlayerClass() { 
	return "player" + (curPlayer ? "1" : "0");
}

function setPlayer(newPlayer) {
	curPlayer = newPlayer;
	document.getElementById("current-player").className = curPlayerClass();
}

function msg(m) {
	document.getElementById("msg").innerText = m;
}