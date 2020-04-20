// Designed to be minified with https://javascript-minifier.com/
// All objects in global scope have single letter names

g = 0; // Is game over, Psuedo-bool
s(0); // Players are 0 and 1, 0 goes first, sets global variable p (current player) to 0
t(1);
// variables r and c anywhere refer to row and column

// Initialize board
for (r = 6; r > 0; r--) {
	h = "";
	for (c = 1; c < 8; c++)
		h += '<td id="c'+r+c+'" class="b" onclick="m('+c+')">';
	e("b").innerHTML += "<tr>"+h+"</tr>";
}

function m(c) { // move
	if (g) location = ""; 
	r = lowestEmptyRow(c);
	z("c"+r+c, n());
	if (winDir(0, 1) || winDir(1, 0) || winDir(1, 1) || winDir(1, -1)) t(3);
	else {
		s(1-p); t(2); // Switch to other player's turn
		
		// Check if the board is full
		for (c = 1; c < 8; c++) if (lowestEmptyRow(c)) return;
		t(4);
	}
	g = 1; // Only get here if won or tie
	
	function winDir(incRow, incCol) {
		for (i = -3; i < 4; i++) {
			count = (getChip(r+incRow*i, c+incCol*i) == n()) ? ++count : 0;
			if (count > 3) return 1;
		}
	}
	
	function lowestEmptyRow(c) { for (r = 1; r < 7; r++) if (getChip(r, c) == "b") return r; }
	function getChip(r, c) { return (r < 1 || c < 1 || r > 6 || c > 7) ? 0 : e("c"+r+c).className; }
}

function n() { return "p" + p; } // name of class for current player
function s(newPlayer) { p = newPlayer; z("p", n()); } // set player
function t(msg) { z("m", "m"+msg); } // text of current message
function e(id) { return document.querySelector("#"+id); } // get element by id
function z(id, name) { e(id).className = name; } // set className of element with id