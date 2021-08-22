const express = require("express");
const app  = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { MONGO_USER, 
		MONGO_PASSWORD, 
		MONGO_IP, 
		MONGO_PORT, 
		REDIS_URL, 
		SESSION_SECRET,
		REDIS_PORT } = require("./config/config");
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?
				 authSource=admin`;

const redis = require('redis')
const session = require('express-session')
const cors = require("cors")
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
	host: REDIS_URL,
	port: REDIS_PORT
})

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const connectWithRetry = () => {
	
	mongoose
		.connect(mongoURL)
		.then(() => console.log("sucessfully connect to db"))
		.catch((e) => {
			console.log(e)
			setTimeout(connectWithRetry, 5000) //5 seconds
		});
}

connectWithRetry();
//Allow the Node-app trust all the requests from the Nginx 
app.enable("trust proxy");
app.use(cors({}))

app.use(session({
	store: new RedisStore({client: redisClient}),
	secret: SESSION_SECRET,
	cookie:{
		secure: false,
		resave: false,
		saveUninitialized: false,
		httpOnly: true,
		maxAge: 6000
	}
}))
app.use(express.json())

app.get("/api/v1", (req, res) => {
	res.send("<h1>Router DEVELOPING DOCKER</h2>");
	console.log("Load balancing")
});

//localhost:3000/api/v1/posts/
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, ()=> console.log(`listening on port ${port}`))
