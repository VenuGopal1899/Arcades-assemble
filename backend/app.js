const express = require('express');
const mongoose = require('mongoose');
const engines = require('consolidate');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const User = require('./models/user')

const port = 4000;

// Remove Deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

dotenv.config();
// Setup Express app
const app = express();
app.use(express.json());

// Connect to remote MongoDB cluster

const dbURI = process.env.MONGODB_URI;

// Local MongoDB Server
// const dbURI = 'mongodb://localhost:27017/login-app-db';

mongoose.connect(dbURI)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))

mongoose.Promise = global.Promise;

// Add a Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));

app.engine('html', engines.mustache);
app.set('view engine', 'html');

// Routes
app.get('/', (req, res) => res.redirect('/login'));
app.get('/games', (req, res) => res.render('homepage.html'));
app.get('/games/guess-the-color', (req, res) => res.render('colorGame.html'));
app.get('/games/tetris', (req, res) => res.render('tetris.html'));
app.get('/games/game-2048', (req, res) => res.render('game-2048.html'));
app.get('/games/flappy-bird', (req, res) => res.render('flappy-bird.html'));
app.get('/games/classic-snake', (req, res) => res.render('classic-snake.html'));
app.get('/signup', (req, res) => res.render('signup.html'));
app.get('/login', (req, res) => res.render('login.html'));
app.get('/gamerProfile', (req, res) => res.render('gamerProfile.html'));


let refreshTokens = []

const randomString = () => {
	let randStr = ''
	for(let i = 0; i<32; i++) {
		const ch = Math.floor((Math.random() * 10) + 1)
		randStr += ch;
	}
	return randStr;
}

const sendEmail = (email, ign, verifyUniqueString) => {
	const transport = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
		  user: process.env.GMAIL_USER,
		  pass: process.env.GMAIL_PASS,
		},
	});
	var mailOptions;
	let sender = "Arcade_Assemble"
	mailOptions = {
		from: sender,
		to: email,
		subject: "Email confirmation",
		html: `
				<h2>Hi ${ign}, </h2>
				<h4> You are almost ready to start enjoying Arcades Assemble. </h4>
				<h4>Click <a href=http://localhost:4000/api/verify/${verifyUniqueString}> here </a> to verify your email.</h4>
				`
	}
	transport.sendMail(mailOptions, function(error, response) {
		if(error)
			console.log(error)
		else
			console.log("Message sent")
	})
}

app.post('/api/signup', async (req, res) => {
	const {firstName, middleName, lastName, useremail, ign, password: plainTextPassword } = await req.body

	const password = await bcrypt.hash(plainTextPassword, 10)
	const uniqueString = randomString()

	try {
		const response = await new User({
			firstName : firstName,
			middleName: middleName,
			lastName  : lastName,
			useremail : useremail,
			ign       : ign ,
			password  : password,
			emailSecret: uniqueString
		}).save()
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			console.log(error)
			return res.json({ status: 'error', error: error.keyPattern })

		}
		throw error
	}
	sendEmail(useremail, ign, uniqueString)
	res.json({ status: 'ok' })
})

app.get('/api/verify/:uniqueString', async (req, res) => {
	const { uniqueString } = req.params
	// console.log(uniqueString)
	const user = await User.findOne({ emailSecret: uniqueString })
	if (user) {
		user.confirmed = true
		await user.save()
		res.redirect('/')
	}
	else
		res.json({status: 'error', error: 'User not found'})
})

app.post('/api/login', async (req, res) => {
	const { ign, password } = req.body
	const user = await User.findOne({ ign }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid IGN/Password' })
	}

	if( user.confirmed === false) {
		return res.json({ status: 'error', error: 'Email not confirmed'})
	}

	if (await bcrypt.compare(password, user.password)) {
		// the ign, password combination is successful

		const accessToken = generateAccessToken(user)
		const refreshToken = jwt.sign(
			{
				id: user._id,
				ign: user.ign
			},
			process.env.REFRESH_TOKEN_SECRET
		)

		refreshTokens.push(refreshToken)

		return res.json({ status: 'ok', accessToken: accessToken, refreshToken: refreshToken })
	}

	res.json({ status: 'error', error: 'Invalid IGN/Password' })
})

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if(token == null) return res.json({status: 'error', error:'No token present'})
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.json({ status: 'error', error: 'Invalid jwt token'})
		req.user = user
		next()
	})
}


function generateAccessToken(user) {
	return jwt.sign(
		{
			id: user._id,
			ign: user.ign
		},
		process.env.ACCESS_TOKEN_SECRET,
		{expiresIn: '15m'}
	)
}

app.post('/token', (req, res) => {
	const refreshToken = req.body.token
	if (refreshToken == null) return res.json({ status: 'error', error: 'No refrresh token found' })
	if (!refreshTokens.includes(refreshToken)) return res.json({ status: 'error', error: 'Invalid token' })
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
		if (err) return res.json({ status: 'error', error: 'Invalid token' })
		const accessToken = generateAccessToken({ user })
		res.json({ accessToken: accessToken })
	})
})

app.delete('/logout', (req, res) => {
	refreshTokens = refreshTokens.filter(token => token !== req.body.token)
	res.json({ status: 'ok'})
  }
)

app.listen(process.env.PORT || port)