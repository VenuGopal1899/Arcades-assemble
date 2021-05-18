var seconds = 15;
const form = document.getElementById("signup-form")

form.addEventListener('submit', signupUser);

async function signupUser(e){
    e.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const middleName = document.getElementById("middleName").value;
    const lastName = document.getElementById("lastName").value;
    const useremail = document.getElementById("email").value;
    const ign = document.getElementById("ign").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if(password !== confirmPassword){
        document.getElementById("err-message").innerHTML = "Passwords do not match!"
        return;
    }

    document.getElementById("err-message").innerHTML = "";

    const result = await fetch('/api/signup', {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName, middleName, lastName, useremail, ign, password
        })
    }).then(res => res.json());

    if(result.status === 'ok'){
        // User registered successfully
        document.getElementById("signupForm").style.display = "none";
        document.getElementsByClassName("account-exists")[0].style.display = "none";
        document.getElementById("verify-email").style.display = "revert";
        document.getElementById("redirect-login").style.display = "revert";
        countDown();
    } else {
        var msg = Object.keys(result.error)[0].toUpperCase();
        document.getElementById("err-message").innerHTML = ((msg==="USEREMAIL")?'E-mail':msg)+' already in use.'
    }
}

function countDown(){
    if(seconds < 0){
        window.location.href = "http://localhost:4000/login";
    } else {
        document.getElementById("countDown").innerHTML = seconds + ' secs';
        seconds = seconds-1;
        window.setTimeout("countDown()", 1000);
    }
}