// Rows are counted from the bottom up (bottom row = 1)
const ROWS = 6;
const COLS = 7;

// First theme is default
const THEMES = ["KU", "Traditional"];

// Players are 0 and 1 (false and true)
let curPlayer = false;

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
	
	// Initialize theme selector
	let themeSelector = document.getElementById("theme-selector");
	themeSelector.addEventListener("change", () => setTheme(themeSelector.value));
	for (let theme of THEMES) {
		let option = document.createElement("option");
		option.value = theme.toLowerCase();
		option.innerText = theme;
		if (localStorage.getItem("theme") === theme.toLowerCase()) {
			option.selected = "selected";
			setTheme(theme.toLowerCase());
		}
		themeSelector.appendChild(option);
	}
});

function setTheme(theme) {
	document.getElementById("theme").href = "theme-" + theme + "/style.css";
	localStorage.setItem("theme", theme);
}

function clickCol(col) {
	// Find the lowest empty space in the column clicked
	for (let row = 1; row <= ROWS; row++) {
		if (getChip(row, col) === "blank") {
			setChip(row, col, curPlayerClass());
			if (checkWin(row, col)) {
				msg("player wins!");
			}
			else {
				msg("player's turn");
				setPlayer(!curPlayer);
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