var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");

const grid = {
  gridElement: document.getElementsByClassName("grid")[0],
  cells: [],
  playable: false,
  directionRoots: {
    // roots are the first row's or column's indexes of swipe direction
    UP: [1, 2, 3, 4],
    RIGHT: [4, 8, 12, 16],
    DOWN: [13, 14, 15, 16],
    LEFT: [1, 5, 9, 13],
  },
  init: function () {
    const cellElements = document.getElementsByClassName("cell");
    let cellIndex = 1;
    for (let cellElement of cellElements) {
      this.cells[cellIndex] = {
        element: cellElement,
        top: cellElement.offsetTop,
        left: cellElement.offsetLeft,
        number: null,
      };

      cellIndex++;
    }

    // spawn first number and start game
    number.spawn();
    this.playable = true;
    document.getElementsByClassName("score")[0].innerHTML = 0;
    document.getElementsByClassName("new-game")[0].innerHTML = "New Game";
    document.getElementsByClassName("game-over")[0].innerHTML = "";

  },
  reset: function () {
    const num = document.getElementsByClassName("number");
    while (num[0]) {
      num[0].parentNode.removeChild(num[0]);
    }
    this.init();
  },
  randomEmptyCellIndex: function () {
    let emptyCells = [];

    for (let i = 1; i < this.cells.length; i++) {
      if (this.cells[i].number === null) {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      // no empty cell, game over
      return false;
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  },
  slide: function (direction) {
    if (!this.playable) {
      return false;
    }

    // set playable to false to prevent continous slides
    this.playable = false;

    // get direction's grid root indexes
    const roots = this.directionRoots[direction];

    // indexes increments or decrements depend on direction
    let increment = direction === "RIGHT" || direction === "DOWN" ? -1 : 1;

    // nidexes moves by
    increment *= direction === "UP" || direction === "DOWN" ? 4 : 1;

    // start loop with root index
    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];

      // increment or decrement through grid from root
      // j starts from 1 bc no need to check root cell
      for (let j = 1; j < 4; j++) {
        const cellIndex = root + j * increment;
        const cell = this.cells[cellIndex];

        if (cell.number !== null) {
          let moveToCell = null;

          // check if cells below(to root) this cell empty or has same number
          // to decide to move or stay
          // k starts from j-1 first cell below j
          // k ends by 0 which is root cell
          for (let k = j - 1; k >= 0; k--) {
            const foreCellIndex = root + k * increment;
            const foreCell = this.cells[foreCellIndex];

            if (foreCell.number === null) {
              // the cell is empty, move to and check next cell
              moveToCell = foreCell;
            } else if (
              cell.number.dataset.value === foreCell.number.dataset.value
            ) {
              // the cell has same number, move, merge and stop
              moveToCell = foreCell;
              break;
            } else {
              // next cell is not empty and not same with moving number(number is moving cell is not)
              // number can't go further
              break;
            }
          }

          if (moveToCell !== null) {
            number.moveTo(cell, moveToCell);
          }
        }
      }
    }

    // spawn a new number and make game playable
    setTimeout(function () {
      if (number.spawn()) {
        grid.playable = true;
      } else {
        document.getElementsByClassName("game-over")[0].innerHTML = "Game Over!";
        document.getElementsByClassName("new-game")[0].innerHTML = "Play Again?";
      }
    }, 500);
  },
};

const number = {
  numbers: [],
  getElements: function () {
    const numberElements = document.getElementsByClassName("number");

    for (let numberElement of numberElements) {
      this.numbers.push(numberElement);
    }
  },
  spawn: function () {
    const emptyCellIndex = grid.randomEmptyCellIndex();

    if (emptyCellIndex === false) {
      return false;
    }

    const numberElement = document.createElement("div");
    let newNumberValue = Math.pow(2, Math.floor(Math.random() * 2) + 1);
    if (newNumberValue == 2) numberElement.style.backgroundColor = "#eee4da";
    else if (newNumberValue == 4)
      numberElement.style.backgroundColor = "#ede0c8";

    numberElement.innerText = newNumberValue;
    numberElement.dataset.value = newNumberValue;
    numberElement.classList.add("number");

    numberElement.style.top = `${grid.cells[emptyCellIndex].top}px`;
    numberElement.style.left = `${grid.cells[emptyCellIndex].left}px`;

    grid.cells[emptyCellIndex].number = numberElement;

    grid.gridElement.append(numberElement);

    return true;
  },
  moveTo: function (fromCell, toCell) {
    const number = fromCell.number;

    if (toCell.number === null) {
      // target cell is empty fill with number
      number.style.top = `${toCell.top}px`;
      number.style.left = `${toCell.left}px`;

      toCell.number = number;
      fromCell.number = null;
    } else if (number.dataset.value === toCell.number.dataset.value) {
      // target cell has same number
      // merge both cell

      number.style.top = `${toCell.top}px`;
      number.style.left = `${toCell.left}px`;
      number.style.opacity = "0";

      // remove number DOM element after transition
      setTimeout(() => {
        grid.gridElement.removeChild(number);
      }, 500);

      // double target cell's number
      const newNumberValue = toCell.number.dataset.value * 2;
      const score = document.getElementsByClassName("score")[0];
      score.innerHTML = parseInt(score.innerHTML) + parseInt(newNumberValue);
      if (score.innerHTML == 2048) {
        document.getElementsByClassName("result")[0].innerHTML =
          "You Won!Now enjoy infinite mode.";
      }
      toCell.number.dataset.value = newNumberValue;
      toCell.number.innerText = newNumberValue;
      if (newNumberValue == 0) toCell.number.style.backgroundColor = "#afa192";
      else if (newNumberValue == 2)
        toCell.number.style.backgroundColor = "#eee4da";
      else if (newNumberValue == 4)
        toCell.number.style.backgroundColor = "#ede0c8";
      else if (newNumberValue == 8)
        toCell.number.style.backgroundColor = "#f2b179";
      else if (newNumberValue == 16)
        toCell.number.style.backgroundColor = "#ffcea4";
      else if (newNumberValue == 32)
        toCell.number.style.backgroundColor = "#e8c064";
      else if (newNumberValue == 64)
        toCell.number.style.backgroundColor = "#ffab6e";
      else if (newNumberValue == 128)
        toCell.number.style.backgroundColor = "#fd9982";
      else if (newNumberValue == 256)
        toCell.number.style.backgroundColor = "#ead79c";
      else if (newNumberValue == 512)
        toCell.number.style.backgroundColor = "#76daff";
      else if (newNumberValue == 1024)
        toCell.number.style.backgroundColor = "#beeaa5";
      else if (newNumberValue == 2048)
        toCell.number.style.backgroundColor = "#d7d4f0";
      else if (newNumberValue == 4096)
        toCell.number.style.backgroundColor = "#000033";
      fromCell.number = null;
    }
  },
};

grid.init();

document
  .getElementsByClassName("new-game")[0]
  .addEventListener("click", function () {
    grid.reset();
  });

document.addEventListener("keyup", function (e) {
  let direction = null;

  if (e.key == "ArrowUp") {
    direction = "UP";
  } else if (e.key == "ArrowRight") {
    direction = "RIGHT";
  } else if (e.key == "ArrowDown") {
    direction = "DOWN";
  } else if (e.key == "ArrowLeft") {
    direction = "LEFT";
  }

  if (direction !== null) {
    grid.slide(direction);
  }
  return false;
});

/////leaderboard pop up///////////
btn.addEventListener("click", function(){
	modal.style.display = "block";
})
var span = document.getElementsByClassName("close")[0];
span.addEventListener("click", function(){
	modal.style.display = "none";
})
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function logout(){
  if(localStorage.getItem("JWT")){
      localStorage.removeItem("JWT");
  }
  window.location.href = "http://localhost:4000/login";
}

function checkLoginStatus(){
  if(!localStorage.getItem("JWT")){
    document.getElementById("login-btn").innerHTML = "Login";
  }
}