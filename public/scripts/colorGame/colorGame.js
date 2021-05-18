var numSquares = 6;
var colors = [];
var pickedColor;
var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");
var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");
var score = 0;
var maxScore = 100;
var alreadyWon = false;

var startTimeStamp;
var endTimeStamp;
var isLoggedIn = true;
const gameName = "guess-the-color";
var gameScore = 0;

const sound={
    select: new Audio('../../resources/colorGame/sounds/select.mp3')
}

init();

function init(){
	setupModeButtons();
	setupSquares();
	reset();
}

function logout(){
	isLoggedIn = false;
    userLogout();
}

function checkLoginStatus(){
	if(!(localStorage.getItem("JWT") && localStorage.getItem("RefreshToken"))){
		document.getElementById("login-btn").innerHTML = "Login";
		isLoggedIn = false;
	}
}

const scoresList = document.getElementsByClassName("members-with-score")[0];

async function getScores(){
    if(isLoggedIn){
        const innerhtml = await getLeaderboardScores(gameName);
        scoresList.innerHTML = innerhtml;
    } else {
        scoresList.innerHTML = '<div class="not-logged-in"><span>Please <a href="/login">login</a> to record your results.</span></div>';
    }
}

function setupModeButtons(){
	for(var i = 0; i < modeButtons.length; i++){
		modeButtons[i].addEventListener("click", function(){
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			reset();
		});
	}
}

function setupSquares(){
	for(var i = 0; i < squares.length; i++){
	//add click listeners to squares
		squares[i].addEventListener("click", function(){
			//grab color of clicked square
			var clickedColor = this.style.backgroundColor;
			//compare color to pickedColor
			if(clickedColor === pickedColor){
				if(!alreadyWon){
				score += maxScore;
				gameScore = score;
				sound.select.play();
				}
				endTimeStamp = new Date();
				const duration_mins = parseFloat((endTimeStamp.getTime() - startTimeStamp.getTime())/60000).toFixed(3);
				if(isLoggedIn){
					recordDurationStatistics(gameName, duration_mins);
					var payloadObject = JSON.parse(atob(localStorage.getItem("JWT").split('.')[1]));
    				addScoreToLeaderboard(gameName, payloadObject.ign, payloadObject.hashedEmail, gameScore);
				}
				alreadyWon = true;
				messageDisplay.textContent = "SCORE : " + score;
				resetButton.textContent = "Play Again?"
				changeColors(clickedColor);
				h1.style.background = clickedColor;
			} else {
				maxScore -= 20;
				this.style.background = "#232323";
				messageDisplay.textContent = "SCORE : " + score;
				sound.select.play();
			}

		});
	}
}



function reset(){
	if(!alreadyWon){
		startTimeStamp = new Date();
	}
	maxScore = 100;
	alreadyWon = false;
	colors = generateRandomColors(numSquares);
	//pick a new random color from array
	pickedColor = pickColor();
	//change colorDisplay to match picked Color
	colorDisplay.textContent = pickedColor;
	resetButton.textContent = "New Colors"
	messageDisplay.textContent = "SCORE : " + score;
	//change colors of squares
	for(var i = 0; i < squares.length; i++){
		if(colors[i]){
			squares[i].style.display = "block"
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		}
	}
	h1.style.background = "steelblue";
	// ani();
}

resetButton.addEventListener("click", function(){
	reset();
})

function changeColors(color){
	//loop through all squares
	for(var i = 0; i < squares.length; i++){
		//change each color to match given color
		squares[i].style.background = color;
	}
}

function pickColor(){
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

function generateRandomColors(num){
	//make an array
	var arr = []
	//repeat num times
	for(var i = 0; i < num; i++){
		//get random color and push into arr
		arr.push(randomColor())
	}
	//return that array
	return arr;
}

function randomColor(){
	//pick a "red" from 0 - 255
	var r = Math.floor(Math.random() * 256);
	//pick a "green" from  0 -255
	var g = Math.floor(Math.random() * 256);
	//pick a "blue" from  0 -255
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}


/////leaderboard pop up///////////
const open = document.getElementById("open");
const modal_Container = document.getElementById("modal_container");
const close = document.getElementById("close");

open.addEventListener("click",() => {
    modal_Container.classList.add("show");
});
close.addEventListener("click",() => {
    modal_Container.classList.remove("show");
});