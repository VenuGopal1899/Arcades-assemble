const express = require('express');
const mongoose = require('mongoose');
const engines = require('consolidate');
const path = require('path');

// Remove Deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// Setup Express app
const app = express();

// Connect to Local MongoDB
mongoose.connect('mongodb://localhost:27017/pjpbatch6');
mongoose.Promise = global.Promise;

// Add a Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));

app.engine('html', engines.mustache);
app.set('view engine', 'html');

// listen for requests
app.listen(4000, () => {
    console.log('Now listening for requests');
})

app.get('/', (req, res) => res.redirect('/games'));
app.get('/games', (req, res) => res.render('homepage.html'));
app.get('/games/guess-the-color', (req, res) => res.render('colorGame.html'));
app.get('/games/tetris', (req, res) => res.render('tetris.html'));
app.get('/games/game-2048', (req, res) => res.render('game-2048.html'));
app.get('/games/flappy-bird', (req, res) => res.render('flappy-bird.html'));
app.get('/games/classic-snake', (req, res) => res.render('classic-snake.html'));