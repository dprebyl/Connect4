// Designed to be minified with https://javascript-minifier.com/ with result stored in "j" (js file with no extension)
// All objects in global scope have single letter names

// Utility functions
t = msg => z("m", "m"+msg); // text of current message
e = id => document.getElementById(id);
z = (id="p", name=p) => e(id).lang = name; // set className of element with id (defaults to updating current player indicator)
g = (r, c) => (r < 1 || c < 1 || r > 6 || c > 7) ? 0 : e("c"+r+c).lang; // get class of chip

// Setup global variables
o = 0; // Is game over, Psuedo-bool
p = "p";  // Players are "p" and "q", p goes first
z(); // Set chip display for current player
t(1);
// variables r and c anywhere refer to row and column

// Initialize board
for (r = 6; r > 0; r--) {
	h = "<tr>";
	for (c = 1; c < 8; c++) h += '<td id=c'+r+c+' lang=b onclick=m('+c+')>';
	e("b").innerHTML += h;
}

m = c => { // move (place piece)
	l = () => { for (r = 1; r < 7; r++) if (g(r, c) == "b") return r; } // Lowest empty row in column c (uses outside c variable)
	w = (incRow, incCol=1) => { // Check if current player wins in direction from current r, c
		for (i = -3; i < 4; i++) {
			count = (g(r+incRow*i, c+incCol*i) == p) ? ++count : 0;
			if (count > 3) return 1;
		}
	}

	if (o) location = ""; // Reload page to reset board
	r = l();
	z("c"+r+c);
	if (w(0) || w(1, 0) || w(1) || w(-1)) t(3);
	else {
		p = p>"p"?"p":"q";
		z();
		t(2); // Switch to other player's turn
		
		// Check if the board is full
		for (c = 1; c < 8; c++) if (l()) return;
		t(4);
	}
	o = 1; // Only get here if won or tie
}