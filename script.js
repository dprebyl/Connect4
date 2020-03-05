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
			let chip = document.createElement("button");
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
			if (checkWin(row, col)) {
				msg((curPlayerIsRed ? "Red" : "Black") + " player wins!");
				curPlayerIsRed = !curPlayerIsRed; // Allows continued play
			}
			else {
				curPlayerIsRed = !curPlayerIsRed;
				msg((curPlayerIsRed ? "Red" : "Black") + " player's turn");
			}
			return;
		}
	}
	msg("Invalid move (column full)");
}

function checkWin(row, col) {
	return checkDir(0, 1) || checkDir(1, 0) || checkDir(1, 1) || checkDir(1, -1);

	function checkDir(incRow, incCol) {
		var count = 0;
		for (var i = -3; i <= 3; i++) {
			if (getChip(row+incRow*i, col+incCol*i) === (curPlayerIsRed ? "red" : "black")) {
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
	return document.getElementById("cell"+row+col).className;
}

function setChip(row, col, type) {
	document.getElementById("cell"+row+col).className = type;
}

function msg(m) {
	document.getElementById("msg").innerText = m;
}