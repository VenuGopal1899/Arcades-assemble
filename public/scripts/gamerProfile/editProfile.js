const user = JSON.parse(sessionStorage.getItem("user"));

document.querySelector("h1").innerHTML = user.ign;
document.getElementById("firstName").value = user.firstName;
document.getElementById("middleName").value = user.middleName;
document.getElementById("lastName").value = user.lastName;
document.getElementById("email").value = user.useremail;

const url = "http://www.gravatar.com/avatar/" + user.hashedEmail + "?d=monsterid";
document.querySelector(".avatarimg").src = url;

document.addEventListener('submit', editUserProfile);
function editUserProfile(e){
    e.preventDefault();
    editProfile();
}