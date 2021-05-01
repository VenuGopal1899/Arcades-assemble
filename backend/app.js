const express = require('express');
const mongoose = require('mongoose');
const engines = require('consolidate');
const path = require('path');
const dotenv = require('dotenv');
const port = 4000;

// Remove Deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

dotenv.config();
// Setup Express app
const app = express();

// Connect to remote MongoDB cluster
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI,{useNewUrlParser: true,useUnifiedTopology:true})
.then((result) => {
    console.log("You are now connected successfully to database")
    app.listen(port, () => {
        console.log('Now listening on port ' + port );
    })
})
.catch((err)=> {   // Catch error if not connected to database
   console.log(err);
})
mongoose.Promise = global.Promise;

// Add a Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));

app.engine('html', engines.mustache);
app.set('view engine', 'html');

// listen for requests

app.get('/', (req, res) => res.redirect('/games'));
app.get('/games', (req, res) => res.render('homepage.html'));
app.get('/games/guess-the-color', (req, res) => res.render('colorGame.html'));
app.get('/games/tetris', (req, res) => res.render('tetris.html'));
app.get('/games/game-2048', (req, res) => res.render('game-2048.html'));
app.get('/games/flappy-bird', (req, res) => res.render('flappy-bird.html'));
app.get('/games/classic-snake', (req, res) => res.render('classic-snake.html'));