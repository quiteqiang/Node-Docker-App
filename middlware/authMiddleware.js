const protect = (req, res, next) =>{
	const {user} = req.session;
	console.log(req.session)	
	if (!user) {
		console.log(user)
		return res.status(401).json({
			status: 'fail',
			message:'unauthorized'
		})
	}
	req.user = user
	next()
}

module.exports = protect
