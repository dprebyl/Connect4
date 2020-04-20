let gameOver = false;

// Players are false and true, false is always human and goes first
let curPlayer = false;

window.addEventListener("DOMContentLoaded", () => {
	setPlayer(false);
	
	// Initialize board and chips array
	let board = document.getElementById("board");
	for (let row = 6; row >= 1; row--) {
		let tr = document.createElement("tr");
		for (let col = 1; col <= 7; col++) {
			tr.innerHTML += '<td id="cell'+row+col+'" class="blank" onclick="clickCol('+col+')"></td>';
		}
		board.appendChild(tr);
	}
});

function clickCol(col) {
	if (gameOver) return resetGame();
	let row = lowestEmptyRow(col);
	
	setChip(row, col, curPlayerClass());
	if (checkWin(row, col)) {
		msg("player wins!");
		gameOver = true;
	}
	else {
		// Check if the board is full
		for (let col = 1; col <= 7; col++) {
			if (lowestEmptyRow(col) !== -1) break;
			else if (col == 7) {
				msg("Full board - tie game!");
				gameOver = true;
				return;
			}
		}
		
		// Switch to other player's turn
		msg("player's turn");
		setPlayer(!curPlayer);
		gameState = 1;
	}
}

function checkWin(row, col) {
	return checkDir(0, 1) || checkDir(1, 0) || checkDir(1, 1) || checkDir(1, -1);

	function checkDir(incRow, incCol) {
		let count = 0;
		for (let i = -3; i <= 3; i++) {
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
	for (let row = 6; row >= 1; row--) {
		for (let col = 1; col <= 7; col++) {
			setChip(row, col, "blank");
		}
	}
	gameOver = false;
	setPlayer(false);
	msg("goes first");
}

function lowestEmptyRow(col) {
	for (let row = 1; row <= 6; row++)
		if (getChip(row, col) === "blank") return row;
	return -1; // Column full
}

function curPlayerClass() { 
	return "player" + (curPlayer ? "1" : "0");
}

function getChip(row, col) {
	if (row < 1 || col < 1 || row > 6 || col > 7) return undefined;
	return document.getElementById("cell"+row+col).className;
}

function setChip(row, col, type) {
	document.getElementById("cell"+row+col).className = type;
}

function curPlayerClass() { 
	return "player" + +curPlayer;
}

function setPlayer(newPlayer) {
	curPlayer = newPlayer;
	document.getElementById("current-player").className = curPlayerClass();
}

function msg(m) {
	document.getElementById("msg").innerText = m;
}