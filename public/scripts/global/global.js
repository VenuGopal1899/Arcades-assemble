async function getNewAcessToken(){
  const REFRESH_TOKEN = localStorage.getItem("RefreshToken");
  const newAccessToken = await fetch('/token', {
    method: 'POST',
    headers: {
      'Authorization': 'REFRESH_TOKEN '+ REFRESH_TOKEN,
      'Content-type': 'application/json'
    }
  }).then(res => res.json());

  if(localStorage.getItem("JWT")){
    localStorage.removeItem("JWT");
  }
  localStorage.setItem("JWT", newAccessToken);
}

async function recordDurationStatistics(gameName, duration_mins){
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const result = await fetch('/api/gamePlayedDuration', {
    method: 'POST',
    headers: {
      'Authorization': 'ACCESS_TOKEN '+ ACCESS_TOKEN,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      gameName, duration_mins
    })
  }).then(res => res.json());

  if(result.status == 'error' && result.tokenExpired){
    await getNewAcessToken();
    recordDurationStatistics(gameName, duration_mins);
  }
}

async function userLogout(){
  const REFRESH_TOKEN = localStorage.getItem("RefreshToken");
  const response = await fetch('/api/logout', {
    method: 'DELETE',
    headers: {
      'Authorization': 'REFRESH_TOKEN '+ REFRESH_TOKEN,
      'Content-type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(err => console.log(err))
  .then(() => {
    if(localStorage.getItem("JWT")){
      localStorage.removeItem("JWT");
      localStorage.removeItem("RefreshToken");
    }
  })
  .then(() => {
    window.location.href = "http://localhost:4000/login";
  });
}

async function addScoreToLeaderboard(gameName, ign, hashedEmail, score){
  // console.log('gameName, ign, score ', gameName, ign, score);
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const result = await fetch(`/api/games/${gameName}`, {
    method: 'POST',
    headers: {
      'Authorization': 'ACCESS_TOKEN '+ ACCESS_TOKEN,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      gameName, ign, hashedEmail, score
    })
  }).then(res => res.json());

  if(result.status == 'error' && result.tokenExpired){
    await getNewAcessToken();
    addScoreToLeaderboard(gameName, ign, hashedEmail, score);
  }
}

async function getLeaderboardScores(gameName){
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const result = await fetch('/api/leaderboard', {
    method: 'POST',
    headers: {
      'Authorization': 'ACCESS_TOKEN '+ ACCESS_TOKEN,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      gameName
    })
  }).then(res => res.json())

  if(result.status == 'error' && result.tokenExpired){
    getNewAcessToken();
    getLeaderboardScores(gameName);
  }
  else if(result.status === 'ok'){
    return result.records;
  }
}