const router = require("express").Router();

const PostControllers = require("../controllers/postControllers");
const authentication = require("../middlewares/authentication");
const { authorizationPost } = require("../middlewares/authorization");

router.post("/", authentication, PostControllers.createNewPost);
router.get("/", authentication, PostControllers.getAllPosts);
router.get("/all-user-login-posts", authentication, PostControllers.getAllUserLoginPosts);
router.get("/:id", authentication, PostControllers.getPostById);
router.put("/:id", authentication, authorizationPost, PostControllers.updatePostById);
router.delete("/:id", authentication, authorizationPost, PostControllers.deletePostById);

router.put("/edit-like/:id", authentication, PostControllers.updateLike)
router.put("/delete-like/:like", authentication, PostControllers.updateLikeToZero)
router.put("/edit-dislike/:id", authentication, PostControllers.updateDislike)

module.exports = router;