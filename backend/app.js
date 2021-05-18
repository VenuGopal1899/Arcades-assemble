const express = require('express');
const mongoose = require('mongoose');
const engines = require('consolidate');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const crypto = require('crypto');
const cors = require('cors');

const User = require('./models/user')
const DurationGame = require('./models/durationgame')
const Leaderboard = require('./models/leaderboard');

const {entry} = require('./controllers/leaderboard')


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
app.use(cors());

// Connect to remote MongoDB cluster
// const dbURI = process.env.MONGODB_URI;

// Local MongoDB Server
const dbURI = 'mongodb://localhost:27017/login-app-db';

mongoose.connect(dbURI)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', async () => {
	console.log('Connected to mongoose')
	await new Leaderboard({}).save()
	}
)
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
app.get('/editProfile', (req, res) => res.render('editProfile.html'));


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
		if(error) {
			console.log(error)
			sendEmail(email, ign, verifyUniqueString)
		}
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
		var emailstr = user.useremail
		user.confirmed = true
		user.hashedEmail =  crypto.createHash('md5').update(emailstr).digest('hex')
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
	// console.log(authHeader)
	const token = authHeader && authHeader.split(' ')[1]
	// console.log(token)
	if(token == null) return res.json({status: 'error', error:'No token present'})
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.json({ status: 'error', error: 'Invalid jwt token', tokenExpired: true})
		req.user = user
		next()
	})
}


function generateAccessToken(user1) {
	console.log('New access token generated')
	return jwt.sign(
		{
			ign: user1.ign,
			hashedEmail: user1.hashedEmail,
			createdAt: Date.now()
		},
		process.env.ACCESS_TOKEN_SECRET,
		{expiresIn: '15m'}
	)
}

app.post('/token', (req, res) => {
	const authHeader = req.headers['authorization']
	// console.log(authHeader)
	const refreshToken = authHeader && authHeader.split(' ')[1]
	// console.log(refreshToken)
	// console.log(refreshTokens)

	if (refreshToken == null) return res.json({ status: 'error', error: 'No refrresh token found' })
	if (!refreshTokens.includes(refreshToken)) return res.json({ status: 'error', error: 'Invalid token' })
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
		// console.log(user)
		const user1 = await User.findOne({ ign: user.ign}).lean();
		// console.log(user1)
		if (err) return res.json({ status: 'error', error: 'Invalid token' })
		const accessToken = generateAccessToken(user1)
		res.json({ accessToken: accessToken })
	})
})

app.delete('/api/logout', (req, res) => {
	const authHeader = req.headers['authorization']
	const reqToken = authHeader && authHeader.split(' ')[1]
	refreshTokens = refreshTokens.filter(token => token !== reqToken)
	res.json({ status: 'ok'})
  }
)

app.post('/api/profile', authenticateToken, async (req, res) => {
	// console.log(req.user);
	const {ign} = await req.body;
	let user = await User.findOne({ign: ign}, {password: 0, emailSecret: 0, _id: 0});
	if(user) {
		// console.log(user);
		return res.json({status: 'okay', user: user})
	}
	else{
		res.json({status: 'error', msg: 'user not found'});
	}
})

app.post('/api/editProfile', async (req, res) => {
	const { ign, firstName, lastName, middleName } = req.body;
	const newDetails = {firstName: firstName, lastName: lastName, middleName: middleName};
	const user = await User.findOneAndUpdate({ ign: ign }, newDetails, {new: true});
	return res.json({ status: 'ok', msg: 'Entry updated'});
})

app.post('/api/gamePlayedDuration', authenticateToken, async (req, res) => {
	const {gameName, duration_mins} = await req.body;
	try {
		DurationGame.find({gameName: gameName}, (err, res) => {
			if(res.length === 0){
				DurationGame.create({
					gameName: gameName,
					duration_mins: parseFloat(duration_mins)
				});
				console.log('DurationGame added succesfully');
			}
			else {
				const existingDuration = res[0].duration_mins;
				const newDuration = parseFloat(existingDuration) + parseFloat(duration_mins);
				res[0].duration_mins = parseFloat(newDuration).toFixed(3);
				res[0].save();
				console.log('DurationGame updated succesfully ');
			}
		});
	} catch (error) {
		console.log(error);
		return res.json({status: 'error', error: error});
	}
	return res.json({status: 'ok'});
})

app.get('/api/gamePlayedDuration', async (req, res) => {
	DurationGame.find({}, (err, r) => {
		return res.json({status: 'ok', r: r});
	})
})

app.post('/api/games/guess-the-color', authenticateToken, entry)
app.post('/api/games/tetris', authenticateToken, entry)
app.post('/api/games/game-2048', authenticateToken, entry)
app.post('/api/games/flappy-bird', authenticateToken, entry)
app.post('/api/games/classic-snake', authenticateToken, entry)

app.post('/api/leaderboard', authenticateToken, async (req, res) => {
	const {gameName} = await req.body
	let records = await Leaderboard.find({gameName: gameName}).limit(10).sort([["score", "desc"]]).exec()
	res.json({ status: 'ok', records: records});
})

app.listen(process.env.PORT || port)