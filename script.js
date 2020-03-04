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
			curPlayerIsRed = !curPlayerIsRed;
			break;
		}
	}
}

function getChip(row, col) {
	return document.getElementById("cell"+row+col).className;
}

function setChip(row, col, type) {
	document.getElementById("cell"+row+col).className = type;
}