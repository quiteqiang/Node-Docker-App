const User = require("../models/userModels")
const bcrypt = require("bcryptjs") 

exports.signUp = async (req, res) =>{
	const {username, password} = req.body
	try{
		const hashpassword = await bcrypt.hash(password, 12);
		const newUser = await User.create({
			username,
			password: hashpassword
		});
		req.session.user = newUser;
		res.status(201).json({
			status: "success",
			data:{
				user: newUser
			}
		});
	}catch(e){
		console.log(e)
		res.status(400).json({
			status: "fail"
		})
	}
}

exports.login = async(req, res) =>{
	const {username, password} = req.body;
	try{
		const user = await User.findOne({username});

		if (!user){ //user not found
			return res.status(404).json({
				status:'fail',
				message: 'user not found'
			})
		}

		const isCorrect = await bcrypt.compare(password, user.password)

		if (isCorrect){
			req.session.user = user;	
			return res.status(200).json({
				status: 'success'
			})
		}else{
				return res.status(400).json({
					status: 'incorrect username or password'
				})
		}
		const hashpassword = await bcrypt.hash(password, 12);
		const newUser = await User.create({
			username,
			password: hashpassword
		});
	}catch(e){
		console.log(e)
		return res.status(400).json({
			status: "fail"
		})
	}
}
