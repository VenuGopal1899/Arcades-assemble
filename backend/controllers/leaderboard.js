const Leaderboard = require("../models/leaderboard");
const User = require("../models/user");

exports.entry = async (req, res) => {
    const {gameName, ign, score} = await req.body;

	try {
		// Check for existing entry from that user
		const entryFound = await Leaderboard.findOne({ gameName: gameName, ign: ign}
			// , (err,res) => {
			// if(res.length === 0) {
			// 	Leaderboard.create({
			// 		gameName: gameName,
			// 		ign : ign,
			// 		score: score
			// 	})
			// }}
		).lean();
		console.log(entryFound)
		if(entryFound){
			console.log(entryFound.score)
			if(entryFound.score >= score){
				return res.json({ status: 'ok'});
			} else {
				await Leaderboard.findOneAndUpdate({ gameName: gameName, ign: ign}, req.body, {new: true});
				return res.json({ status: 'ok', msg: 'Entry updated in Leaderboard'});
			}
		} else {
			// Get last entry from table after sorting
			const count = await Leaderboard.find({gameName: gameName}).countDocuments()
			if(count>=50) {
				const lastEntry = await Leaderboard.find({gameName: gameName}).sort({score: 1}).limit(1);
				const lastEntry1 = lastEntry[0];
				if(lastEntry1.score >= score){
					return res.json({status: 'ok'});
				} else {
					await Leaderboard.findOneAndUpdate({ gameName: lastEntry1.gameName, ign: lastEntry1.ign}, req.body, {new: true});
					return res.json({ status: 'ok', msg: 'Entry updated in Leaderboard'});
				}
			}
			// For new entry into table
			else {
				const response = await new Leaderboard({
					gameName: gameName,
					ign: ign ,
					score: score
				}).save()
				console.log('Added entry to Leaderboard successfully: ', response)

				return res.json({ status: 'ok', res: response});
			}
		}
	} catch (error) {
		console.log(error);
		return res.json({ status: 'error', error: error})
	}
}