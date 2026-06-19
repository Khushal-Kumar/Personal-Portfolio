var rows = 3;
var columns = 3;

var currTile;
var otherTile; // blank tile
var turns = 0;

// The Solved State
const solvedOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
// Current state
let imgOrder = []; 

// Which image filename represents the empty slot?
// Assuming 9.jpg is the blank/white square based on 3x3 grid
const blankTile = "3.jpg"; // Based on your previous code you checked for "3.jpg", but usually it's the last one (9). Change this if needed.

window.onload = function() {
    initGame();
}

function initGame() {
    imgOrder = [...solvedOrder]; // Copy solved state
    createBoard();
    shuffleGame(); // Shuffle immediately
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // Clear board

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            // Calculate index in the 1D array
            let index = r * columns + c;
            
            tile.id = r.toString() + "-" + c.toString();
            tile.src = imgOrder[index] + ".jpg";

            // Click functionality (Better for mobile than drag/drop)
            tile.addEventListener("click", clickTile);
            
            // Visual tweak: if it's the blank tile, lower opacity 
            // (Optional: remove this if your 3.jpg is just a white square)
            if (tile.src.includes(blankTile)) {
                tile.style.opacity = "0"; 
                tile.style.cursor = "default";
            }

            board.append(tile);
        }
    }
}

function clickTile() {
    let currTile = this;
    
    // You can't move the blank tile itself
    if (currTile.src.includes(blankTile)) return;

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    // Check neighbors for the blank tile
    checkAndSwap(r, c, r-1, c); // Up
    checkAndSwap(r, c, r+1, c); // Down
    checkAndSwap(r, c, r, c-1); // Left
    checkAndSwap(r, c, r, c+1); // Right
    
    checkWin();
}

function checkAndSwap(r, c, r2, c2) {
    // Check bounds
    if (r2 < 0 || r2 >= rows || c2 < 0 || c2 >= columns) return;

    // Get the neighbor element
    let neighborId = r2 + "-" + c2;
    let neighbor = document.getElementById(neighborId);

    // If neighbor is the blank tile, Swap!
    if (neighbor.src.includes(blankTile)) {
        let currTile = document.getElementById(r + "-" + c);
        
        // Swap sources
        let temp = currTile.src;
        currTile.src = neighbor.src;
        neighbor.src = temp;

        // Swap visual styles (opacity)
        currTile.style.opacity = "0";
        currTile.style.cursor = "default";
        neighbor.style.opacity = "1";
        neighbor.style.cursor = "pointer";

        turns += 1;
        document.getElementById("turns").innerText = turns;
    }
}

// Logic to shuffle by simulating random VALID clicks
// This ensures the puzzle is always solvable
function shuffleGame() {
    turns = 0;
    document.getElementById("turns").innerText = turns;
    document.getElementById("message").innerText = "";

    // Perform 100 random valid moves
    for (let i = 0; i < 100; i++) {
        // Find location of blank tile
        let blank = findBlank();
        let r = blank.r;
        let c = blank.c;

        // Get all possible neighbors
        let neighbors = [];
        if (r > 0) neighbors.push((r-1) + "-" + c);
        if (r < rows-1) neighbors.push((r+1) + "-" + c);
        if (c > 0) neighbors.push(r + "-" + (c-1));
        if (c < columns-1) neighbors.push(r + "-" + (c+1));

        // Pick random neighbor and swap
        let randomNeighborId = neighbors[Math.floor(Math.random() * neighbors.length)];
        let neighbor = document.getElementById(randomNeighborId);
        
        // Manually trigger the swap logic (without increasing turn count visually yet)
        let currBlank = document.getElementById(r + "-" + c);
        let temp = currBlank.src;
        currBlank.src = neighbor.src;
        neighbor.src = temp;
        
        // Fix opacities
        currBlank.style.opacity = "1";
        neighbor.style.opacity = "0";
    }
}

function findBlank() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r + "-" + c);
            if (tile.src.includes(blankTile)) {
                return {r: r, c: c};
            }
        }
    }
}

function checkWin() {
    let currentBoard = [];
    let tiles = document.querySelectorAll("#board img");
    
    // Check if every tile matches the solved order
    // Note: This requires your image filenames to correspond to numbers (1.jpg, 2.jpg...)
    let isWin = true;
    tiles.forEach((tile, index) => {
        // Extract filename from full URL
        let fileName = tile.src.substring(tile.src.lastIndexOf("/") + 1).replace(".jpg", "");
        if (fileName !== solvedOrder[index]) {
            isWin = false;
        }
    });

    if (isWin) {
        document.getElementById("message").innerText = "You Won!";
    }
}