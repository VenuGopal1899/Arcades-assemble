function showProfile(user)
{
    if(user){
        var uuser = JSON.stringify(user);
        console.log(uuser);
        sessionStorage.setItem("user", uuser);
        window.location.href = "http://localhost:4000/gamerProfile";
    }

}
function show()
{
    // console.log(user);
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user);
    const url = "http://www.gravatar.com/avatar/" + user.hashedEmail + "?d=monsterid";
    document.querySelector(".profileImage").src = url;
    document.querySelector(".profileImageShort").src = url;
    document.getElementById("ign").innerHTML = user.ign;
    document.getElementById("name").innerHTML = user.firstName +" " + user.middleName + " "+ user.lastName;
    document.getElementById("email").innerHTML = user.useremail;
    document.getElementById("flappybird").innerHTML = user.highscore_flappy_bird;
    document.getElementById("snakegame").innerHTML = user.highscore_classic_snake;
    document.getElementById("game2048").innerHTML = user.highscore_game_2048;
    document.getElementById("tetris").innerHTML = user.highscore_tetris;
    document.getElementById("guessthecolor").innerHTML = user.highscore_guess_the_color;

}