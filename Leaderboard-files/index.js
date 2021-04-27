var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");



/////leaderboard pop up///////////
btn.addEventListener("click", function(){
	modal.style.display = "block";
})
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
span.addEventListener("click", function(){
	modal.style.display = "none";
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}