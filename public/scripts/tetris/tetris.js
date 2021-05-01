document.querySelectorAll("button").forEach( function(item) {
    item.addEventListener('focus', function() {
        this.blur();
    })
})
const cvs = document.getElementById("grid");
const ctx = cvs.getContext("2d");
const canvasNext = document.getElementById("next");
const ctxNext = canvasNext.getContext("2d");
const canvasHold = document.getElementById("hold");
const ctxHold = canvasHold.getContext("2d");

ctx.canvas.width = 250;
ctx.canvas.height = 500;

const row = 20; /* No of Rows in Grid */
const col = 10; /* No of Columns in Grid */
const pixel=ctx.canvas.width/col; /* Pixel size of Grid */
const boardColour="black";  /* Board Colour */
const gridLineColour="MidNightBlue"; /*Grid Line Colour */

ctxNext.canvas.width = pixel*7;
ctxNext.canvas.height = pixel*3;
ctxHold.canvas.width = pixel*7;
ctxHold.canvas.height = pixel*3;

var lineClear=0;
var highScore=0;
var score=0;
var difficultyLevel=3;

document.getElementById("score").innerHTML = lineClear*10;
document.getElementById("line").innerHTML = lineClear;

var board = [];
for(var i = 0; i < row; i++)
    board.push(new Array(col).fill(boardColour));

var pauseBoard = [];
for(var i = 0; i < row; i++)
    pauseBoard.push(new Array(col).fill(boardColour));

var pieceBoard = [];
for(var i = 0; i < 3; i++)
    pieceBoard.push(new Array(7).fill(boardColour));

var holdBoard = [];
for(var i = 0; i < 3; i++)
    holdBoard.push(new Array(7).fill(boardColour));

/* Funtion to draw single Pixel */
function drawPixel( x, y, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = gridLineColour
    ctx.strokeRect( x*pixel, y*pixel, pixel, pixel);
    ctx.fillRect( x*pixel, y*pixel, pixel, pixel);
}
/* Funtion to draw single Pixel for next piece*/
function drawPixelNext( x, y, color) {
    ctxNext.fillStyle = color;
    ctxNext.strokeStyle = gridLineColour
    ctxNext.strokeRect( x*pixel, y*pixel, pixel, pixel);
    ctxNext.fillRect( x*pixel, y*pixel, pixel, pixel);
}
/* Funtion to draw single Pixel for hold piece*/
function drawPixelHold( x, y, color) {
    ctxHold.fillStyle = color;
    ctxHold.strokeStyle = gridLineColour
    ctxHold.strokeRect( x*pixel, y*pixel, pixel, pixel);
    ctxHold.fillRect( x*pixel, y*pixel, pixel, pixel);
}
/* Funtion to draw tetromino */
function drawPiece() {
    var block = piece.pieceName;
    for(var i = 0; i < block.length; i++)
        for(var j = 0; j < block.length; j++)
            if( block[i][j] == 1)
                drawPixel( piece.xPos +j, piece.yPos+i, piece.colour);
}
/* Funtion to draw next tetromino */
function drawNextPiece() {
    clearPieceBoard();
    var block = nextPiece.pieceName;
    for(var i = 0; i < block.length; i++)
        for(var j = 0; j < block.length; j++)
            if( block[i][j] == 1)
                drawPixelNext( 1+j, i, nextPiece.colour);
}
/* Funtion to draw next tetromino */
function drawHoldPiece() {
    clearHoldPiece();
    if(holdPiece != null){
        var block = holdPiece.pieceName;
        for(var i = 0; i < block.length; i++)
            for(var j = 0; j < block.length; j++)
                if( block[i][j] == 1)
                    drawPixelHold( 1+j, i, holdPiece.colour);
    }
}
/* Funtion to remove tetromino */
function removePiece() {
    var block = piece.pieceName;
    for(var i = 0;i < block.length; i++)
        for(var j = 0; j < block.length; j++)
            if( block[i][j] == 1)
                drawPixel( piece.xPos +j, piece.yPos+i, boardColour);
}
/* Funtion to draw board */
function drawBoard(gameBoard) {
    for(var i = 0; i < row; i++)
        for(var j = 0;j < col; j++)
            drawPixel( j, i, gameBoard[i][j]);

    document.getElementById("level").innerHTML = difficultyLevel;
}
/* Funtion to draw next piece board */
function drawPieceBoard(pieceBoard) {
    for(var i = 0; i < 3; i++)
        for(var j = 0;j < 7; j++)
            drawPixelNext( j, i, pieceBoard[i][j]);
}
/* Funtion to draw hold piece board */
function drawHoldPieceBoard(holdBoard) {
    for(var i = 0; i < 3; i++)
        for(var j = 0;j < 7; j++)
            drawPixelHold( j, i, holdBoard[i][j]);
}
/* Funtion to clear next piece board */
function clearPieceBoard() {
    for(var i = 0; i < 3; i++)
        for(var j = 0; j < 7; j++)
            drawPixelNext( j, i, boardColour);
}
/* Funtion to clear hold piece board */
function clearHoldPiece() {
    for(var i = 0; i < 3; i++)
        for(var j = 0; j < 7; j++)
            drawPixelHold( j, i, boardColour);
}


/* Object preloading sounds */
const sound={
    main: new Audio('../../resources/tetris/sound/main.mp3'),
    line: new Audio('../../resources/tetris/sound/line.mp3'),
    move: new Audio('../../resources/tetris/sound/move.mp3'),
    fall: new Audio('../../resources/tetris/sound/fall.mp3'),
    rotate: new Audio('../../resources/tetris/sound/rotate.mp3'),
    hold: new Audio('../../resources/tetris/sound/swap.mp3'),
    gameover: new Audio('../../resources/tetris/sound/gameover.mp3')
}

const I=[   [ 0, 0, 0, 0],
            [ 1, 1, 1, 1],
            [ 0, 0, 0, 0],
            [ 0, 0, 0, 0]
        ];
const O=[   [ 0, 1, 1],
            [ 0, 1, 1],
            [ 0, 0, 0]
        ];
const T=[   [ 0, 1, 0],
            [ 1, 1, 1],
            [ 0, 0, 0],
        ];
const S=[   [ 0, 1, 1],
            [ 1, 1, 0],
            [ 0, 0, 0],
        ];
const Z=[   [ 1, 1, 0],
            [ 0, 1, 1],
            [ 0, 0, 0],
        ];
const J=[   [ 1, 0, 0],
            [ 1, 1, 1],
            [ 0, 0, 0],
        ];
const L=[   [ 0, 0, 1],
            [ 1, 1, 1],
            [ 0, 0, 0],
        ];

var srsMap = new Map( [
                            [ "01",[[ 0, 0],    [-1, 0],    [-1,+1],    [ 0,-1],    [-1,-2] ]],
                            [ "03",[[ 0, 0],    [+1, 0],    [+1,+1],    [ 0,-1],    [+1,-2] ]],
                            [ "12",[[ 0, 0],	[+1, 0],	[+1,-1],	[ 0,+2],	[+1,+2] ]],
                            [ "10",[[ 0, 0],	[+1, 0],	[+1,-1],	[ 0,+2],	[+1,+2] ]],
                            [ "21",[[ 0, 0],	[-1, 0],	[-1,+1],	[ 0,-2],	[-1,-2] ]],
                            [ "23",[[ 0, 0],	[+1, 0],	[+1,+1],	[ 0,-2],	[+1,-2] ]],
                            [ "30",[[ 0, 0],	[-1, 0],	[-1,-1],	[ 0,+2],	[-1,+2] ]],
                            [ "32",[[ 0, 0],	[-1, 0],	[-1,-1],	[ 0,+2],	[-1,+2] ]]
]); //SRS rotation system for T, S, Z, J, L piece
var srsMapI = new Map(  [
                            [ "01",[[ 0, 0],	[-2, 0],	[+1, 0],	[-2,-1],	[+1,+2] ]],
                            [ "03",[[ 0, 0],	[-1, 0],	[+2, 0],	[-1,+2],	[+2,-1] ]],
                            [ "12",[[ 0, 0],	[-1, 0],	[+2, 0],	[-1,+2],	[+2,-1] ]],
                            [ "10",[[ 0, 0],	[+2, 0],	[-1, 0],	[+2,+1],	[-1,-2] ]],
                            [ "21",[[ 0, 0],	[+1, 0],	[-2, 0],	[+1,-2],	[-2,+1] ]],
                            [ "23",[[ 0, 0],	[+2, 0],	[-1, 0],	[+2,+1],	[-1,-2] ]],
                            [ "30",[[ 0, 0],	[+1, 0],	[-2, 0],	[+1,-2],	[-2,+1] ]],
                            [ "32",[[ 0, 0],	[-2, 0],	[+1, 0],	[-2,-1],	[+1,+2] ]]
]); //SRS rotation system for I piece

/*var srsMapI = new Map(  [
                            [ "01",[[ 0, 0],	[-2, 0],	[+1, 0],	[+1,+2],	[-2,-1] ]],
                            [ "03",[[ 0, 0],	[ 2, 0],	[-1, 0],	[-1,+2],	[+2,-1] ]],
                            [ "12",[[ 0, 0],	[-1, 0],	[+2, 0],	[-1,+2],	[+2,-1] ]],
                            [ "10",[[ 0, 0],	[+2, 0],	[-1, 0],	[+2,+1],	[-1,-2] ]],
                            [ "21",[[ 0, 0],	[-2, 0],	[ 1, 0],	[-2, 1],	[ 1,-1] ]],
                            [ "23",[[ 0, 0],	[+2, 0],	[-1, 0],	[+2,+1],	[-1,-1] ]],
                            [ "30",[[ 0, 0],	[+1, 0],	[-2, 0],	[+1,-2],	[-2,+1] ]],
                            [ "32",[[ 0, 0],	[+1, 0],	[-2, 0],	[ 1, 2],	[-2,-1] ]]
]);*/ //Akira SRS rotation system for I piece

var tetromino = [ I, O, T, S, Z, J, L]; /*Array to hold default tetromino */
var colours = [ "cyan", "yellow", "purple", "green", "red", "blue", "orange"];
var piece = newPiece();
var nextPiece = newPiece();
var holdPiece = null; /* Holds swapped pieces */
var holdLock = false; /* prevents swaping tetromino untill swaped piece is placed */
var moveLock=false;/* Lock movement while dropping by default */
var pause=true;/* Pause variable */

/* Funtion to generate new tetromino */
function newPiece() {
    var choice = Math.floor(Math.random()*tetromino.length);
    return {pieceName: tetromino[choice], colour: colours[choice], xPos: 3, yPos: -2, rotation: 0, type: choice};
}
/* Funtion to Pause Game */
function togglePause() {
    if(pause) {
        document.getElementById("toggle-pause-content").innerHTML = "Pause";
        drawBoard(board);

        drawPieceBoard(pieceBoard);
        drawHoldPieceBoard(holdBoard);
        drawPiece();
        drawNextPiece();
        drawHoldPiece();

        drawPiece();
    }
    else{
        document.getElementById("toggle-pause-content").innerHTML = "Resume";
        drawBoard(pauseBoard);
        drawPieceBoard(pieceBoard);
        drawHoldPieceBoard(holdBoard);
    }
    pause=!pause;
}
document.addEventListener( "keydown", inputKey);
function inputKey(event)
{
    if( ( event.keyCode==65 || event.keyCode==37 ) )
        move("left");
    else if( ( event.keyCode==68 || event.keyCode==39 ) )
        move("right");
    else if( ( event.keyCode==83 || event.keyCode==40 ) )
        move("down");
    else if( ( event.keyCode==87 || event.keyCode==38 ) )
        while(defaultDrop());
    else if( ( event.keyCode==81 || event.keyCode==17 ) )
        rotateBlock("left");
    else if( ( event.keyCode==69 || event.keyCode==96 ) )
        rotateBlock("right");
    else if(event.keyCode==32)
        swapPiece();
    else if(event.keyCode==27)
        togglePause();
    else if(event.keyCode==13)
        newGame();
}
/* Funtion for movement */
function move(direction) {
    if(moveLock)
        return;
    if(direction == "left" && !checkCollision( piece.pieceName, piece.xPos - 1, piece.yPos)) {
        removePiece();
        piece.xPos -= 1;
        drawPiece();
    }
    else if(direction == "right" && !checkCollision( piece.pieceName, piece.xPos + 1, piece.yPos)) {
        removePiece();
        piece.xPos += 1;
        drawPiece();
    }
    else if(direction=="down" && !checkCollision( piece.pieceName, piece.xPos, piece.yPos + 1)) {
        removePiece();
        piece.yPos += 1;
        drawPiece();
    }
    sound.move.play();
}
/* Funtion to check collision */
function checkCollision( block, xPos, yPos) {

    for(var i = 0; i < block.length; i++) {
        for(var j = 0;j < block[0].length; j++) {

            if( block[i][j] == 0 || i + yPos < 0)
                continue;
            if( j + xPos <0 || j + xPos >= col) /* Side wall collision */
                return true;
            if( i + yPos >= row) /* bottom wall collision */
                return true;
            if(board[i+yPos][j+xPos] != boardColour) /* Stack collision */
                return true;
        }
    }
    return false;
}
/* Rotate block left */
function leftRotate( block) {
    var N = block.length;
    for (var i = 0; i < N / 2; i++)
    {
        for (var j = i; j < N - i - 1; j++)
        {
            var temp = block[i][j];
            block[i][j] = block[j][N-1-i];
            block[j][N-1-i] = block[N-1-i][N-1-j];
            block[N-1-i][N-1-j] = block[N-1-j][i];
            block[N-1-j][i] = temp;
        }
    }
}
/* Rotate block right */
function rightRotate( block) {
    var N = block.length;
    for (var i = 0; i < N / 2; i++) {
        for (var j = i; j < N - i - 1; j++) {

            var temp = block[i][j];
            block[i][j] = block[N-1-j][i];
            block[N-1-j][i] = block[N-1-i][N-1-j];
            block[N-1-i][N-1-j] = block[j][N-1-i];
            block[j][N-1-i] = temp;
        }
    }
}
/* Rotate tetrominos */
function rotateBlock(dir) {
    if(piece.type == 1)
        return;
    var block = piece.pieceName.map(function(arr) {
        return arr.slice();
    });

    var rotationPrev = piece.rotation;  /* Current Rotation state */
    var rotationNew;    /* New Rotation state */

    if(dir == "left") {
        leftRotate( block);
        rotationNew =( rotationPrev + 3) % 4; /* New rotation state after left rotation */
    }
    if(dir == "right") {
        rightRotate( block);
        rotationNew=( rotationPrev + 1 )% 4; /* New rotation state after right rotation */
    }

    if(piece.type == 0)
        var offsetArr = srsMapI.get( rotationPrev.toString() + rotationNew.toString() ); /* Offset for I piece */
    else
        var offsetArr = srsMap.get( rotationPrev.toString() + rotationNew.toString() ); /* Offset for T, S, Z, J, L piece */

    for(var i = 0; i < offsetArr.length; i++) {
        if(!checkCollision( block, piece.xPos + offsetArr[i][0], piece.yPos + offsetArr[i][1]))
        {
            removePiece();
            piece.pieceName = block;
            piece.xPos += offsetArr[i][0]; /* setting X offset */
            piece.yPos += offsetArr[i][1]; /* setting Y offset */
            piece.rotation = rotationNew;  /* Update rotation value */
            drawPiece();
            sound.rotate.play();
            break;
        }
    }
}
/* Rotate tetrominos */
function rotateHoldBlock() {
    var rotationPrev = holdPiece.rotation;  /* Current Rotation state */
    if(holdPiece.type == 1 || rotationPrev == 0 || rotationPrev == 2)
        return;
    var block = holdPiece.pieceName.map(function(arr) {
        return arr.slice();
    });

    var rotationNew;    /* New Rotation state */

    if(rotationPrev == 1) {
        leftRotate( block);
        rotationNew =( rotationPrev + 3) % 4; /* New rotation state after left rotation */
    }
    if(rotationPrev == 3) {
        rightRotate( block);
        rotationNew=( rotationPrev + 1 )% 4; /* New rotation state after right rotation */
    }

    if(piece.type == 0)
        var offsetArr = srsMapI.get( rotationPrev.toString() + rotationNew.toString() ); /* Offset for I piece */
    else
        var offsetArr = srsMap.get( rotationPrev.toString() + rotationNew.toString() ); /* Offset for T, S, Z, J, L piece */

    for(var i = 0; i < offsetArr.length; i++) {
        holdPiece.pieceName = block;
        holdPiece.xPos += offsetArr[i][0]; /* setting X offset */
        holdPiece.yPos += offsetArr[i][1]; /* setting Y offset */
        holdPiece.rotation = rotationNew;  /* Update rotation value */
        break;
    }
}
/* Funtion to start new Game */
function newGame() {
    for(var i = 0;i < row; i++)
        for(var j = 0; j < col; j++)
            board[i][j] = boardColour; /* clearing board */

    document.getElementById("game-over-tetris").innerHTML = "";
    document.getElementById("startgame").innerHTML = "Start New Game";
    drawBoard(board);
    drawPieceBoard(pieceBoard);
    drawHoldPieceBoard(holdBoard);
    sound.main.loop=true;
    sound.main.volume=0.4;
    sound.main.play();
    piece=newPiece();
    nextPiece=newPiece();
    drawNextPiece();
    holdPiece=null;
    holdLock=false;
    moveLock=false;
    pause=false;
    lineClear = 0;
}
/* Funtion to end current game */
function gameOver() {
    document.getElementById("game-over-tetris").innerHTML = "Game Over!";
    document.getElementById("startgame").innerHTML = "Play Again ?";
    score=lineClear*10;
    if( score > highScore)
        highScore = score;
    sound.gameover.play();
    pause=true;
    //if( !alert("Game Over\nScore:" + score +"\nHigh Score:" + highScore))
    //    newGame();
}
/* Funtion to swap tetromino */
function swapPiece() {
    if(holdLock == false) {
        removePiece();
        piece.xPos = 3; /* setting default piece X position */
        piece.yPos = -2; /* setting default piece Y position */
        if(holdPiece == null) {
            holdPiece = piece;
            piece = nextPiece;
            nextPiece = newPiece();
            drawNextPiece();
        }
        else {
            var temp = piece;
            piece = holdPiece;
            holdPiece = temp;
        }
        rotateHoldBlock();
        drawHoldPiece();
        sound.hold.play();
    }
    holdLock = true;    /* Setting swap lock */
}
/* Funtion to lock tetromino to the board */
function mergeBoard() {
    for(var i = 0; i < piece.pieceName.length; i++)
        for(var j = 0;j < piece.pieceName[0].length; j++)
            if( piece.pieceName[i][j] == 1) {
                if( i + piece.yPos < 0) {
                    gameOver();
                    return;
                }
                board[ i + piece.yPos][ j + piece.xPos] = piece.colour;
        }
    sound.fall.play();
    holdLock = false; /* Releasing swap lock */
}
/* Funtion to clear filled rows */
function checkLine() {
    for(var i = 0; i < row; i++) {
        var isLineHasSpace = false;
        for(var j = 0;j < col; j++) {
            if(board[i][j] == boardColour) {
                isLineHasSpace = true;
                break;
            }
        }
        if(isLineHasSpace == false) {
            board.splice( i, 1);
            lineClear += 1;
            board.unshift( new Array(col).fill(boardColour));
            sound.line.play();
            drawBoard(board);
        }
    }
    document.getElementById("score").innerHTML = lineClear*10;
    document.getElementById("line").innerHTML = lineClear;
}
/* Funtion to drop tetromino continuously */
function defaultDrop() {
    if(pause)
        return false;
    moveLock=true;
    if( checkCollision( piece.pieceName, piece.xPos, piece.yPos+1)) {
        mergeBoard();
        checkLine();
        piece = nextPiece;
        nextPiece = newPiece();
        return false;
    }
    else {
        removePiece();
        piece.yPos += 1;
    }
    drawPiece();
    drawNextPiece();
    moveLock=false;
    return true;
}
drawBoard(board);
drawPieceBoard(pieceBoard);
drawHoldPieceBoard(holdBoard);
setInterval( defaultDrop, 1000/difficultyLevel);