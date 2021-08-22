const express = require("express")
const postController = require("../controllers/postController")
const router = express.Router()
const protect = require("../middlware/authMiddleware")
//localhost:3000
router
	.route("/")
	.get(protect, postController.getAllPosts)
	.post(protect, postController.createPost)

router
	.route("/:id")
	.get(protect, postController.getOnePosts)
	.patch(protect, postController.updatePosts)
	.delete(protect, postController.deletePosts)

module.exports = router
