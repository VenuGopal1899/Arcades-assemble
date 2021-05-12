const form = document.getElementById("login-form");

form.addEventListener('submit', loginUser);

async function loginUser(e){
	e.preventDefault();
	const ign = document.getElementById("ign").value;
	const password = document.getElementById("password").value;

	document.getElementById("err-message").innerHTML = "";

	const result = await fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-type' : 'application/json'
		},
		body: JSON.stringify({
			ign, password
		})
	}).then(res => res.json());

	if(result.status === 'ok'){
		// console.log('Got the JWT Access Token and Refresh Token', result);
		// accessToken and refreshToken and status : 'ok', will be sent as result
		localStorage.setItem("JWT", result.accessToken);
		localStorage.setItem("RefreshToken", result.refreshToken);
		window.location.href = "http://localhost:4000/games";
	} else {
        document.getElementById("err-message").innerHTML = result.error;
    }
}

const modal_Container = document.getElementById("modal_container");
const close = document.getElementById("close");
const yes = document.getElementById("Yes");
const no = document.getElementById("No");

function skipToDashboard(){
    modal_Container.classList.add("show");
}

close.addEventListener("click", () => {
    modal_Container.classList.remove("show");
});

yes.addEventListener("click", () => {
	window.location.href = "http://localhost:4000/games";
});

no.addEventListener("click", () => {
	modal_Container.classList.remove("show");
});