// Must be single digit
const ROWS = 6;
const COLS = 7;

let curPlayerIsRed = false;

window.addEventListener("DOMContentLoaded", () => {
	// Initialize board
	let board = document.getElementById("board");
	for (let row = ROWS; row >= 1; row--) {
		let tr = document.createElement("tr");
		for (let col = 1; col <= COLS; col++) {
			let td = document.createElement("td");
			td.id = "cell"+row+col;
			td.className = "blank";
			let chip = document.createElement("div");
			chip.className = "chip";
			chip.addEventListener("click", () => { clickCol(col); });
			td.appendChild(chip);
			tr.appendChild(td);
			
		}
		board.appendChild(tr);
	}
});

function clickCol(col) {
	for (let row = 1; row <= ROWS; row++) {
		if (getChip(row, col) === "blank") {
			setChip(row, col, curPlayerIsRed ? "red" : "black");
			if (checkWin(row, col)) alert("You win!");
			curPlayerIsRed = !curPlayerIsRed;
			break;
		}
	}
}

function checkWin(row, col) {
	// This currently won't work if match made in middle
	// new algorithm: For each of the 4 directions, from center-3 to center+3, if wrong color count = 0, if right color count++, if count == 4 return true
	if (row >= 4) {
		if (col >= 4 && checkMatch(row, col, -1, -1)) return true; // Down-left
		if (checkMatch(row, col, -1, 0)) return true; // Down
		if (col <= COLS-4 && checkMatch(row, col, -1, 1)) return true; // Down-right
	}
	if (col >= 4 && checkMatch(row, col, 0, -1)) return true; // Left
	if (col <= COLS-4 && checkMatch(row, col, 0, 1)) return true; // Right
	if (row <= ROWS-4) {
		if (col >= 4 && checkMatch(row, col, 1, -1)) return true; // Up-Left
		if (col <= COLS-4 && checkMatch(row, col, 1, 1)) return true; // Up-Right
	}
	return false;
}

function checkMatch(row, col, incRow, incCol) {
	for (var i = 0; i < 4; i++) {
		if (getChip(row, col) != (curPlayerIsRed ? "red" : "black")) return false;
		row += incRow;
		col += incCol;
	}
	return true;
}

function getChip(row, col) {
	return document.getElementById("cell"+row+col).className;
}

function setChip(row, col, type) {
	document.getElementById("cell"+row+col).className = type;
}