/*----------- Game State Data ----------*/

const board = [
    null,   0,      null,   1,      null,   2,      null,   3,
    4,      null,   5,      null,   6,      null,   7,      null,
    null,   8,      null,   9,      null,   10,     null,   11,
    null,   null,   null,   null,   null,   null,   null,   null,
    null,   null,   null,   null,   null,   null,   null,   null,
    12,     null,   13,     null,   14,     null,   15,     null,
    null,   16,     null,   17,     null,   18,     null,   19,
    20,     null,   21,     null,   22,     null,   23,     null
]

/*---------- Cached Variables ----------*/

// parses pieceId's and returns the index of that piece's place on the board
let findPiece = function (pieceId) {
    let parsed = parseInt(pieceId);
    return board.indexOf(parsed);
};

// DOM referenes
const cells = document.querySelectorAll("td");
let redsPieces = document.querySelectorAll("p");
let blacksPieces = document.querySelectorAll("span")
const redTurnText = document.querySelectorAll(".red-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const divider = document.querySelector("#divider")

// player properties
let turn = true;
let r_Score = 12;
let b_Score = 12;
let playerPieces;

// selected piece properties
let currentSelect = {
    pieceId: -1,
    indexOfBoardPiece: -1,                      //     If X is current selected
    isKing: false,                              //  |_JmpTL_|             |_JmpTR_|
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
function givePiecesEventListeners() {
    if (turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            SearchforJump(redsPieces[i])
        }
    } else {
        for (let i = 0; i < blacksPieces.length; i++) {
            blacksPieces[i].addEventListener("click", getPlayerPieces);
        }
    }
}

/*---------- Logic ----------*/

function AIpossibleMoves(AIcheck){
    if (board[AIcheck.indexOfBoardPiece + 7] === null && cells[AIcheck.indexOfBoardPiece + 7].classList.contains("empty") !== true) {
        AIcheck.BottomL = true;
    }
    if (board[AIcheck.indexOfBoardPiece + 9] === null && cells[AIcheck.indexOfBoardPiece + 9].classList.contains("empty") !== true) {
        AIcheck.BottomR = true;
    }
    if (board[AIcheck.indexOfBoardPiece - 7] === null && cells[AIcheck.indexOfBoardPiece - 7].classList.contains("empty") !== true) {
        AIcheck.TopR = true;
    }
    if (board[AIcheck.indexOfBoardPiece - 9] === null && cells[AIcheck.indexOfBoardPiece - 9].classList.contains("empty") !== true) {
        AIcheck.TopL = true;
    }
    AIjmpMoves(AIcheck)

    if(AIcheck.JmpBottomL == true){

    }
}


function AIjmpMoves(AIcheck){

    if (board[AIcheck.indexOfBoardPiece + 14] === null
        && cells[AIcheck.indexOfBoardPiece + 14].classList.contains("empty") !== true
        && board[AIcheck.indexOfBoardPiece + 7] >= 12) {
        AIcheck.JmpBottomL = true;
    }
    if (board[AIcheck.indexOfBoardPiece + 18] === null
        && cells[AIcheck.indexOfBoardPiece + 18].classList.contains("empty") !== true
        && board[AIcheck.indexOfBoardPiece + 9] >= 12) {
        AIcheck.JmpBottomR = true;
    }
    if (board[AIcheck.indexOfBoardPiece - 14] === null
        && cells[AIcheck.indexOfBoardPiece - 14].classList.contains("empty") !== true
        && board[AIcheck.indexOfBoardPiece - 7] >= 12) {
        AIcheck.JmpTopR = true;
    }
    if (board[AIcheck.indexOfBoardPiece - 18] === null
        && cells[AIcheck.indexOfBoardPiece - 18].classList.contains("empty") !== true
        && board[AIcheck.indexOfBoardPiece - 9] >= 12) {
        AIcheck.JmpTopL = true;
    }



}


























// holds the length of the players piece count
function getPlayerPieces() {
    if (turn) {
        playerPieces = redsPieces;
    } else {
        playerPieces = blacksPieces;
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
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "1px solid white";
    }
    resetcurrentSelectProperties();
    getcurrentSelect();
}

// resets selected piece properties
function resetcurrentSelectProperties() {
    currentSelect.pieceId = -1;
    currentSelect.pieceId = -1;
    currentSelect.isKing = false;
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
    currentSelect.pieceId = parseInt(event.target.id);
    currentSelect.indexOfBoardPiece = findPiece(currentSelect.pieceId);
    isPieceKing();
}

// checks if selected piece is a king
function isPieceKing() {
    if (document.getElementById(currentSelect.pieceId).classList.contains("king")) {
        currentSelect.isKing = true;
    } else {
        currentSelect.isKing = false;
    }
    getAvailableSpaces();
}

// gets the moves that the selected piece can make
function getAvailableSpaces() {
    if (board[currentSelect.indexOfBoardPiece + 7] === null && cells[currentSelect.indexOfBoardPiece + 7].classList.contains("empty") !== true) {
        currentSelect.BottomL = true;
    }
    if (board[currentSelect.indexOfBoardPiece + 9] === null && cells[currentSelect.indexOfBoardPiece + 9].classList.contains("empty") !== true) {
        currentSelect.BottomR = true;
    }
    if (board[currentSelect.indexOfBoardPiece - 7] === null && cells[currentSelect.indexOfBoardPiece - 7].classList.contains("empty") !== true) {
        currentSelect.TopR = true;
    }
    if (board[currentSelect.indexOfBoardPiece - 9] === null && cells[currentSelect.indexOfBoardPiece - 9].classList.contains("empty") !== true) {
        currentSelect.TopL = true;
    }
    checkAvailableJumpSpaces();
}

// gets the moves that the selected piece can jump
function checkAvailableJumpSpaces() {
    if (turn) {
        if (board[currentSelect.indexOfBoardPiece + 14] === null
            && cells[currentSelect.indexOfBoardPiece + 14].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + 7] >= 12) {
            currentSelect.JmpBottomL = true;
        }
        if (board[currentSelect.indexOfBoardPiece + 18] === null
            && cells[currentSelect.indexOfBoardPiece + 18].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + 9] >= 12) {
            currentSelect.JmpBottomR = true;
        }
        if (board[currentSelect.indexOfBoardPiece - 14] === null
            && cells[currentSelect.indexOfBoardPiece - 14].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece - 7] >= 12) {
            currentSelect.JmpTopR = true;
        }
        if (board[currentSelect.indexOfBoardPiece - 18] === null
            && cells[currentSelect.indexOfBoardPiece - 18].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece - 9] >= 12) {
            currentSelect.JmpTopL = true;
        }
    } else {
        if (board[currentSelect.indexOfBoardPiece + 14] === null
            && cells[currentSelect.indexOfBoardPiece + 14].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + 7] < 12 && board[currentSelect.indexOfBoardPiece + 7] !== null) {
            currentSelect.JmpBottomL = true;
        }
        if (board[currentSelect.indexOfBoardPiece + 18] === null
            && cells[currentSelect.indexOfBoardPiece + 18].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece + 9] < 12 && board[currentSelect.indexOfBoardPiece + 9] !== null) {
            currentSelect.JmpBottomR = true;
        }
        if (board[currentSelect.indexOfBoardPiece - 14] === null && cells[currentSelect.indexOfBoardPiece - 14].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece - 7] < 12
            && board[currentSelect.indexOfBoardPiece - 7] !== null) {
            currentSelect.JmpTopR = true;
        }
        if (board[currentSelect.indexOfBoardPiece - 18] === null && cells[currentSelect.indexOfBoardPiece - 18].classList.contains("empty") !== true
            && board[currentSelect.indexOfBoardPiece - 9] < 12
            && board[currentSelect.indexOfBoardPiece - 9] !== null) {
            currentSelect.JmpTopL = true;
        }
    }
    checkPieceConditions();
}

// restricts movement if the piece is a king
function checkPieceConditions() {
    if (currentSelect.isKing) {
        givePieceBorder();
    } else {
        if (turn) {
            currentSelect.TopR = false;
            currentSelect.TopL = false;
            currentSelect.JmpTopR = false;
            currentSelect.JmpTopL = false;
        } else {
            currentSelect.BottomL = false;
            currentSelect.BottomR = false;
            currentSelect.JmpBottomL = false;
            currentSelect.JmpBottomR = false;
        }
        givePieceBorder();
    }
}

// gives the piece a green highlight for the user (showing its movable)
function givePieceBorder() {
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
        cells[currentSelect.indexOfBoardPiece + 7].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + 7].setAttribute("onclick", "makeMove(7)");
    }
    if (currentSelect.BottomR) {
        cells[currentSelect.indexOfBoardPiece + 9].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + 9].setAttribute("onclick", "makeMove(9)");
    }
    if (currentSelect.JmpBottomL) {
        cells[currentSelect.indexOfBoardPiece + 14].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + 14].setAttribute("onclick", "makeMove(14)");
    }
    if (currentSelect.JmpBottomR) {
        cells[currentSelect.indexOfBoardPiece + 18].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece + 18].setAttribute("onclick", "makeMove(18)");
    }
    if (currentSelect.TopR) {
        cells[currentSelect.indexOfBoardPiece - 7].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece - 7].setAttribute("onclick", "makeMove(-7)");
    }
    if (currentSelect.TopL) {
        cells[currentSelect.indexOfBoardPiece - 9].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece - 9].setAttribute("onclick", "makeMove(-9)");
    }
    if (currentSelect.JmpTopR) {
        cells[currentSelect.indexOfBoardPiece - 14].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece - 14].setAttribute("onclick", "makeMove(-14)");
    }
    if (currentSelect.JmpTopL) {
        cells[currentSelect.indexOfBoardPiece - 18].innerHTML = `<p class="checking" id="${currentSelect.pieceId}"></p>`
        cells[currentSelect.indexOfBoardPiece - 18].setAttribute("onclick", "makeMove(-18)");
    }
}

function removePreviousChecks(previousSelect){
    if (previousSelect.BottomL) {
        cells[previousSelect.indexOfBoardPiece + 7].innerHTML = ""
    }
    if (previousSelect.BottomR) {
        cells[previousSelect.indexOfBoardPiece + 9].innerHTML = ""
    }
    if (previousSelect.JmpBottomL) {
        cells[previousSelect.indexOfBoardPiece + 14].innerHTML = ""
    }
    if (previousSelect.JmpBottomR) {
        cells[previousSelect.indexOfBoardPiece + 18].innerHTML = ""
    }
    if (previousSelect.TopR) {
        cells[previousSelect.indexOfBoardPiece - 7].innerHTML = ""
    }
    if (previousSelect.TopL) {
        cells[previousSelect.indexOfBoardPiece - 9].innerHTML = ""
    }
    if (previousSelect.JmpTopR) {
        cells[previousSelect.indexOfBoardPiece - 14].innerHTML = ""
    }
    if (previousSelect.JmpTopL) {
        cells[previousSelect.indexOfBoardPiece - 18].innerHTML = ""
    }
}
/* v when the cell is clicked v */

// makes the move that was clicked
function makeMove(number) {
    console.log("- - - - - - - -  - - - - - - - ")
    removePreviousChecks(currentSelect) //TODO; here
    document.getElementById(currentSelect.pieceId).remove();
    cells[currentSelect.indexOfBoardPiece].innerHTML = "";
    for (let i = 0; i < 64; i++){console.log(cells[i].innerHTML)}
    console.log(cells);
    if (turn) {
        if (currentSelect.isKing) {
            cells[currentSelect.indexOfBoardPiece + number].innerHTML = `<p class="red king" id="${currentSelect.pieceId}"></p>`;
            redsPieces = document.querySelectorAll("p");
        } else {
            cells[currentSelect.indexOfBoardPiece + number].innerHTML = `<p class="red" id="${currentSelect.pieceId}"></p>`;
            redsPieces = document.querySelectorAll("p");
        }
    } else {
        if (currentSelect.isKing) {
            cells[currentSelect.indexOfBoardPiece + number].innerHTML = `<span class="black king" id="${currentSelect.pieceId}"></span>`;
            blacksPieces = document.querySelectorAll("span");
        } else {
            cells[currentSelect.indexOfBoardPiece + number].innerHTML = `<span class="black" id="${currentSelect.pieceId}"></span>`;
            blacksPieces = document.querySelectorAll("span");
        }
    }

    let indexOfPiece = currentSelect.indexOfBoardPiece
    if (number === 14 || number === -14 || number === 18 || number === -18) {
        changeData(indexOfPiece, indexOfPiece + number, indexOfPiece + number / 2);
    } else {
        changeData(indexOfPiece, indexOfPiece + number);
    }
}

// Changes the board states data on the back end
function changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
    board[indexOfBoardPiece] = null;
    board[modifiedIndex] = parseInt(currentSelect.pieceId);
    if (turn && currentSelect.pieceId < 12 && modifiedIndex >= 57) {
        document.getElementById(currentSelect.pieceId).classList.add("king")
    }
    if (turn === false && currentSelect.pieceId >= 12 && modifiedIndex <= 7) {
        document.getElementById(currentSelect.pieceId).classList.add("king");
    }
    if (removePiece) {
        board[removePiece] = null;
        if (turn && currentSelect.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            b_Score--
        }
        if (turn === false && currentSelect.pieceId >= 12) {
            cells[removePiece].innerHTML = "";
            r_Score--
        }
    }
    resetcurrentSelectProperties();
    removeCellonclick();
    removeEventListeners();
}

// removes the 'onClick' event listeners for pieces
function removeEventListeners() {
    if (turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            redsPieces[i].removeEventListener("click", getPlayerPieces);
        }
    } else {
        for (let i = 0; i < blacksPieces.length; i++) {
            blacksPieces[i].removeEventListener("click", getPlayerPieces);
        }
    }
    checkForWin();
}

// Checks for a win
function checkForWin() {
    if (b_Score === 0) {
        divider.style.display = "none";
        for (let i = 0; i < redTurnText.length; i++) {
            redTurnText[i].style.color = "black";
            blackTurntext[i].style.display = "none";
            redTurnText[i].textContent = "RED WINS!";
        }
    } else if (r_Score === 0) {
        divider.style.display = "none";
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "black";
            redTurnText[i].style.display = "none";
            blackTurntext[i].textContent = "BLACK WINS!";
        }
    }
    changePlayer();
}

// Switches players turn
function changePlayer() {
    if (turn) {
        turn = false;
        for (let i = 0; i < redTurnText.length; i++) {
            redTurnText[i].style.color = "lightGrey";
            blackTurntext[i].style.color = "black";
        }
    } else {
        turn = true;
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "lightGrey";
            redTurnText[i].style.color = "black";
        }
    }
    givePiecesEventListeners();
}

givePiecesEventListeners();