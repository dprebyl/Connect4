// Designed to be minified with https://javascript-minifier.com/ with result stored in "j" (js file with no extension)
// All objects in global scope have single letter names

g = 0; // Is game over, Psuedo-bool
p = "p0";  // Players are "p0" and "p1", p0 goes first
z(); // Set chip display for current player
t(1);
// variables r and c anywhere refer to row and column

// Initialize board
for (r = 6; r > 0; r--) {
	h = "<tr>";
	for (c = 1; c < 8; c++) h += '<td id=c'+r+c+' lang=b onclick=m('+c+')>';
	e("b").innerHTML += h;
}

function m(c) { // move
	if (g) location = ""; // Reload page to reset board
	r = lowestEmptyRow();
	z("c"+r+c);
	if (winDir(0) || winDir(1, 0) || winDir(1) || winDir(-1)) t(3);
	else {
		p = "p" + (1-p.substr(1));
		z();
		t(2); // Switch to other player's turn
		
		// Check if the board is full
		for (c = 1; c < 8; c++) if (lowestEmptyRow()) return;
		t(4);
	}
	g = 1; // Only get here if won or tie
	
	function winDir(incRow, incCol=1) {
		for (i = -3; i < 4; i++) {
			count = (getChip(r+incRow*i, c+incCol*i) == p) ? ++count : 0;
			if (count > 3) return 1;
		}
	}
	
	function lowestEmptyRow() { for (r = 1; r < 7; r++) if (getChip(r, c) == "b") return r; } // Lowest empty row in column c
	function getChip(r, c) { return (r < 1 || c < 1 || r > 6 || c > 7) ? 0 : e("c"+r+c).lang; }
}

function t(msg) { z("m", "m"+msg); } // text of current message
function e(id) { return document.querySelector("#"+id); } // get element by id
function z(id="p", name=p) { e(id).lang = name; } // set className of element with id (defaults to updating current player indicator)