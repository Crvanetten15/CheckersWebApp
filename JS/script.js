/*----------- Game State Data ----------*/

const board = [
    null,   0,      null,   1,      null,   2,      null,   3,
    4,      null,   5,      null,   6,      null,   7,      null,
    null,   8,      null,   9,      null,   10,     null,   11,
    null,   null,   null,   null,   null,   null,   null,   null,
    null,   null,   null,   null,   null,   null,   null,   null,
    12,     null,   13,     null,   14,     null,   15,     null,
    null,   16,     null,   17,     null,   18,     null,   19,
    20,     null,   21,     null,   22,     null,   23,     null]

/*---------- Cached Variables ----------*/

// returns the current index of a piece
function getLocation(current_piece) {
    return board.indexOf(current_piece);
}

// Referencing the dom to grab information/ Setting Variables
const cells = document.querySelectorAll("td");
let white_piece = document.querySelectorAll("p");
let red_piece = document.querySelectorAll("span");
const WhiteText = document.querySelectorAll(".whitetext"); //is edit the topic colors to who goes
const RedText = document.querySelectorAll(".redtext");
const divider = document.querySelector("#divider") //does nothing holds space
let IsItWhite = false;
let white_Score = 12; //everytime minus add obj or visual or blah blah
let black_Score = 12;
let current_player;

let directions = { //used for our directions to help navigate
    BL: 7,
    BR: 9,
    JBL: 14,
    JBR: 18,
    TR: -7,
    TL: -9,
    JTR: -14,
    JTL: -18
}

// selected piece properties
let currentSelect = {
    pieceId: -1,
    indexOfBoardPiece: -1,                      //     If X is current selected
    king: false,                              //  |_JmpTL_|             |_JmpTR_|
    BottomL: false,                             //          |_TL_|___|_TR_|
    BottomR: false,                             //          |____|_X_|____|
    JmpBottomL: false,                          //          |_BL_|___|_BR_|
    JmpBottomR: false,                          //  |_JmpBL_|             |_JmpBR_|
    TopR: false, //TopR
    TopL: false, //TopL
    JmpTopR: false, //JmpTopR
    JmpTopL: false //JmpTopL
}

/*---------- Event Listeners ----------*/

// initialize event listeners on pieces
function setEventListeners() {
    if (IsItWhite) {
        for (let i = 0; i < white_piece.length; i++) {
            white_piece[i].addEventListener("click", SetCurrentColor);
        }
    } else {
        for (let i = 0; i < red_piece.length; i++) {
            red_piece[i].addEventListener("click", SetCurrentColor);
        }
    }
}

/*---------- Logic ----------*/

// holds the length of the players piece count
function SetCurrentColor() {
    if (IsItWhite) {
        current_player = white_piece;
    } else {
        current_player = red_piece;
    }
    removeCellonclick();
    resetBorders();
}

// removes possible moves from old selected piece (* this is needed because the user might re-select a piece *)
function removeCellonclick() {
    removePreviousChecks(currentSelect);
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}

// resets borders to default
function resetBorders() {
    for (let i = 0; i < current_player.length; i++) {
        current_player[i].style.border = "1px solid white";
    }
    resetcurrentSelectProperties();
    getcurrentSelect();
}

// resets selected piece properties
function resetcurrentSelectProperties() {
    currentSelect.pieceId = -1;
    currentSelect.pieceId = -1;
    currentSelect.king = false;
    currentSelect.BottomL = false;
    currentSelect.BottomR = false;
    currentSelect.JmpBottomL = false;
    currentSelect.JmpBottomR = false;
    currentSelect.TopR = false;
    currentSelect.TopL = false;
    currentSelect.JmpTopR = false;
    currentSelect.JmpTopL = false;
}

// gets ID and index of the board cell its on
function getcurrentSelect() {
    console.log(cells);
    console.log(white_piece);
    currentSelect.pieceId = parseInt(event.target.id);
    currentSelect.indexOfBoardPiece = getLocation(currentSelect.pieceId);
    isPieceKing();
}

// checks if selected piece is a king
function isPieceKing() {
    if (document.getElementById(currentSelect.pieceId).classList.contains("king")) {
        currentSelect.king = true;
    } else {
        currentSelect.king = false;
    }
    getAvailableSpaces();
}

// gets the moves that the selected piece can make
function getAvailableSpaces() {
    if (board[currentSelect.indexOfBoardPiece + directions.BL] === null && cells[currentSelect.indexOfBoardPiece + directions.BL].classList.contains("empty") !== true) {
        currentSelect.BottomL = true;
    }
    if (board[currentSelect.indexOfBoardPiece + directions.BR] === null && cells[currentSelect.indexOfBoardPiece + directions.BR].classList.contains("empty") !== true) {
        currentSelect.BottomR = true;
    }
    if (board[currentSelect.indexOfBoardPiece + directions.TR] === null && cells[currentSelect.indexOfBoardPiece + directions.TR].classList.contains("empty") !== true) {
        currentSelect.TopR = true;
    }
    if (board[currentSelect.indexOfBoardPiece + directions.TL] === null && cells[currentSelect.indexOfBoardPiece + directions.TL].classList.contains("empty") !== true) {
        currentSelect.TopL = true;
    }
    checkAvailableJumpSpaces();
}

// gets the moves that the selected piece can jump
function checkAvailableJumpSpaces() {
    if (IsItWhite) {
        if (board[currentSelect.indexOfBoardPiece + directions.JBL] === null
            && cells[currentSelect.indexOfBoardPiece + directions.JBL].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + directions.BL] >= 12) {
            currentSelect.JmpBottomL = true;
        }
        if (board[currentSelect.indexOfBoardPiece + directions.JBR] === null
            && cells[currentSelect.indexOfBoardPiece + directions.JBR].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + directions.BR] >= 12) {
            currentSelect.JmpBottomR = true;
        }
        if (board[currentSelect.indexOfBoardPiece + directions.JTR] === null
            && cells[currentSelect.indexOfBoardPiece + directions.JTR].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + directions.TR] >= 12) {
            currentSelect.JmpTopR = true;
        }
        if (board[currentSelect.indexOfBoardPiece + directions.JTL] === null
            && cells[currentSelect.indexOfBoardPiece + directions.JTL].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + directions.TL] >= 12) {
            currentSelect.JmpTopL = true;
        }
    } else {
        if (board[currentSelect.indexOfBoardPiece + directions.JBL] === null
            && cells[currentSelect.indexOfBoardPiece + directions.JBL].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + directions.BL] < 12 && board[currentSelect.indexOfBoardPiece + 7] !== null) {
            currentSelect.JmpBottomL = true;
        }
        if (board[currentSelect.indexOfBoardPiece + directions.JBR] === null
            && cells[currentSelect.indexOfBoardPiece + directions.JBR].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + directions.BR] < 12 && board[currentSelect.indexOfBoardPiece + 9] !== null) {
            currentSelect.JmpBottomR = true;
        }
        if (board[currentSelect.indexOfBoardPiece + directions.JTR] === null && cells[currentSelect.indexOfBoardPiece - 14].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + directions.TR] < 12
            && board[currentSelect.indexOfBoardPiece + directions.TR] !== null) {
            currentSelect.JmpTopR = true;
        }
        if (board[currentSelect.indexOfBoardPiece + directions.JTL] === null && cells[currentSelect.indexOfBoardPiece - 18].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + directions.TL] < 12
            && board[currentSelect.indexOfBoardPiece + directions.TL] !== null) {
            currentSelect.JmpTopL = true;
        }
    }
    MovementRestrictions();
}

// restricts movement if the piece is a king
function MovementRestrictions() {
    if (currentSelect.king) { //give no restrictions cuz king
        selectionIdentifier();
    } else {
        if (IsItWhite) { //if white cant move up
            currentSelect.TopR = false;
            currentSelect.TopL = false;
            currentSelect.JmpTopR = false;
            currentSelect.JmpTopL = false;
        } else { //if red cant move down
            currentSelect.BottomL = false;
            currentSelect.BottomR = false;
            currentSelect.JmpBottomL = false;
            currentSelect.JmpBottomR = false;
        }
        selectionIdentifier();
    }
}

// gives the piece a green highlight for the user (showing its movable)
function selectionIdentifier() {
    if (currentSelect.BottomL || currentSelect.BottomR || currentSelect.JmpBottomL || currentSelect.JmpBottomR
        || currentSelect.TopR || currentSelect.TopL || currentSelect.JmpTopR || currentSelect.JmpTopL) {
        document.getElementById(currentSelect.pieceId).style.border = "3px solid green";
        giveCellsClick();
    } else {
        return;
    }
}

// gives the cells on the board a 'click' based on the possible moves
function giveCellsClick() {
    // setOpenSpaces()
    if (currentSelect.BottomL) {
        cells[currentSelect.indexOfBoardPiece + directions.BL].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + directions.BL].setAttribute("onclick", "makeMove(7)");
    }
    if (currentSelect.BottomR) {
        cells[currentSelect.indexOfBoardPiece + directions.BR].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + directions.BR].setAttribute("onclick", "makeMove(9)");
    }
    if (currentSelect.JmpBottomL) {
        cells[currentSelect.indexOfBoardPiece + directions.JBL].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + directions.JBL].setAttribute("onclick", "makeMove(14)");
    }
    if (currentSelect.JmpBottomR) {
        cells[currentSelect.indexOfBoardPiece + directions.JBR].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + directions.JBR].setAttribute("onclick", "makeMove(18)");
    }
    if (currentSelect.TopR) {
        cells[currentSelect.indexOfBoardPiece + directions.TR].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + directions.TR].setAttribute("onclick", "makeMove(-7)");
    }
    if (currentSelect.TopL) {
        cells[currentSelect.indexOfBoardPiece + directions.TL].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + directions.TL].setAttribute("onclick", "makeMove(-9)");
    }
    if (currentSelect.JmpTopR) {
        cells[currentSelect.indexOfBoardPiece + directions.JTR].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + directions.JTR].setAttribute("onclick", "makeMove(-14)");
    }
    if (currentSelect.JmpTopL) {
        cells[currentSelect.indexOfBoardPiece + directions.JTL].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + directions.JTL].setAttribute("onclick", "makeMove(-18)");
    }
}

function removePreviousChecks(previousSelect){
    if (previousSelect.BottomL) {
        cells[previousSelect.indexOfBoardPiece + directions.BL].innerHTML = ""
    }
    if (previousSelect.BottomR) {
        cells[previousSelect.indexOfBoardPiece + directions.BR].innerHTML = ""
    }
    if (previousSelect.JmpBottomL) {
        cells[previousSelect.indexOfBoardPiece + directions.JBL].innerHTML = ""
    }
    if (previousSelect.JmpBottomR) {
        cells[previousSelect.indexOfBoardPiece + directions.JBR].innerHTML = ""
    }
    if (previousSelect.TopR) {
        cells[previousSelect.indexOfBoardPiece + directions.TR].innerHTML = ""
    }
    if (previousSelect.TopL) {
        cells[previousSelect.indexOfBoardPiece + directions.TL].innerHTML = ""
    }
    if (previousSelect.JmpTopR) {
        cells[previousSelect.indexOfBoardPiece + directions.JTR].innerHTML = ""
    }
    if (previousSelect.JmpTopL) {
        cells[previousSelect.indexOfBoardPiece + directions.JTL].innerHTML = ""
    }
}
/* v when the cell is clicked v */

// makes the move that was clicked
function makeMove(direction) {
    removePreviousChecks(currentSelect) //TODO; here
    document.getElementById(currentSelect.pieceId).remove();
    cells[currentSelect.indexOfBoardPiece].innerHTML = "";
    if (IsItWhite) {
        if (currentSelect.king) {
            cells[currentSelect.indexOfBoardPiece + direction].innerHTML = `<p class="red king" id="${currentSelect.pieceId}"></p>`;
            white_piece = document.querySelectorAll("p");
        } else {
            cells[currentSelect.indexOfBoardPiece + direction].innerHTML = `<p class="red" id="${currentSelect.pieceId}"></p>`;
            white_piece = document.querySelectorAll("p");
        }
    } else {
        if (currentSelect.king) {
            cells[currentSelect.indexOfBoardPiece + direction].innerHTML = `<span class="black king" id="${currentSelect.pieceId}"></span>`;
            red_piece = document.querySelectorAll("span");
        } else {
            cells[currentSelect.indexOfBoardPiece + direction].innerHTML = `<span class="black" id="${currentSelect.pieceId}"></span>`;
            red_piece = document.querySelectorAll("span");
        }
    }

    let indexOfPiece = currentSelect.indexOfBoardPiece
    if (direction === 14 || direction === -14 || direction === 18 || direction === -18) {
        changeData(indexOfPiece, indexOfPiece + direction, indexOfPiece + direction / 2);
    } else {
        changeData(indexOfPiece, indexOfPiece + direction);
    }
}

// Changes the board states data on the back end
function changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
    board[indexOfBoardPiece] = null;
    board[modifiedIndex] = parseInt(currentSelect.pieceId);
    if (IsItWhite && currentSelect.pieceId < 12 && modifiedIndex >= 57) {
        document.getElementById(currentSelect.pieceId).classList.add("king")
    }
    if (IsItWhite === false && currentSelect.pieceId >= 12 && modifiedIndex <= 7) {
        document.getElementById(currentSelect.pieceId).classList.add("king");
    }
    if (removePiece) {
        board[removePiece] = null;
        if (IsItWhite && currentSelect.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            black_Score-- //variable for SCORE - - - - - - - - - - - - - - - - - - ! - - - - - - -

        }
        if (IsItWhite === false && currentSelect.pieceId >= 12) {
            cells[removePiece].innerHTML = "";
            white_Score-- //variable for SCORE - - - - - - - - - - - - - - - - - - ! - - - - - - -
        }
    }
    resetcurrentSelectProperties();
    removeCellonclick();
    removeEventListeners();
}

// removes the 'onClick' event listeners for pieces
function removeEventListeners() {
    if (IsItWhite) {
        for (let i = 0; i < white_piece.length; i++) {
            white_piece[i].removeEventListener("click", SetCurrentColor);
        }
    } else {
        for (let i = 0; i < red_piece.length; i++) {
            red_piece[i].removeEventListener("click", SetCurrentColor);
        }
    }
    Win();
}

// Checks for a win
function Win() {
    if (black_Score === 0) {
        divider.style.display = "none";
        for (let i = 0; i < WhiteText.length; i++) {
            WhiteText[i].style.color = "white";
            RedText[i].style.display = "none";
            WhiteText[i].textContent = "White WINS!";
        }
    } else if (white_Score === 0) {
        divider.style.display = "none";
        for (let i = 0; i < RedText.length; i++) {
            RedText[i].style.color = "red";
            WhiteText[i].style.display = "none";
            RedText[i].textContent = "Red WINS!";
        }
    }
    changePlayer();
}

// Switches players turn IN COLOR
function changePlayer() {
    if (IsItWhite) {
        IsItWhite = false;
        for (let i = 0; i < WhiteText.length; i++) {
            WhiteText[i].style.color = "lightGrey";
            RedText[i].style.color = "red";
        }
    } else {
        IsItWhite = true;
        for (let i = 0; i < RedText.length; i++) {
            RedText[i].style.color = "lightGrey";
            WhiteText[i].style.color = "white";
        }
    }
    setEventListeners();
}

setEventListeners();