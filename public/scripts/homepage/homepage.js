
function checkLoginStatus(){
    if(!(localStorage.getItem("JWT") && localStorage.getItem("RefreshToken"))){
        document.getElementById("gamer-profile").style.display = "none";
        document.getElementById("sign-out").innerHTML = "Login";
        document.getElementById("nav-bar").style = "width: min-content; float: right; margin-right: 20px;"
    }
    else{
        const ign = JSON.parse(window.atob(localStorage.getItem("JWT").split('.')[1])).ign;
        document.getElementById("hellomsg").innerHTML = "Hey, " + ign;
    }
}

function fetchProfile(){
    getProfile();
}

function logout(){
    userLogout();
}