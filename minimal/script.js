/* 
	Global variables:
	g = is game over, psuedo-bool (0 or 1)
	c = current player (0 or 1)
*/
g = 0; // Is game over, Psuedo-bool
s(0); // Players are 0 and 1, 0 goes first

// Initialize board
for (row = 6; row > 0; row--) {
	let cells = "";
	for (col = 1; col < 8; col++)
		cells += '<td id="c'+row+col+'" class="b" onclick="m('+col+')">';
	elId("b").innerHTML += "<tr>"+cells+"</tr>";
}

function m(col) { // move
	if (g) location.reload(); 
	let row = lowestEmptyRow(col);
	elId("c"+row+col).className = cClass();
	if (winDir(0, 1) || winDir(1, 0) || winDir(1, 1) || winDir(1, -1)) msg(3);
	else {
		s(1-c); msg(2); // Switch to other player's turn
		
		// Check if the board is full
		for (col = 1; col < 8; col++) if (lowestEmptyRow(col)) return;
		msg(4);
	}
	g = 1; // Only get here if won or tie
	
	function winDir(incRow, incCol) {
		for (i = -3; i < 4; i++) {
			if (getChip(row+incRow*i, col+incCol*i) == cClass()) count++;
			else count = 0;
			if (count > 3) return 1;
		}
	}
}

function lowestEmptyRow(col) { for (let row = 1; row < 7; row++) if (getChip(row, col) == "b") return row; }
function getChip(row, col) { return (row < 1 || col < 1 || row > 6 || col > 7) ? 0 : elId("c"+row+col).className; }
function cClass() { return "p" + c; }
function s(newPlayer) { c = newPlayer; elId("p").className = cClass(); } // set player
function msg(m) { elId("m").className = "m"+m; }
function elId(id) { return document.querySelector("#"+id); }