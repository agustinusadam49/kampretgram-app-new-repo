const router = require("express").Router();

const IndexController = require("../controllers/indexControllers");

const user_router = require("./userRouter");
const post_router = require("./postRouter");
const profile_router = require("./profileRouter");
const comment_router = require("./commentRouter");
const like_router = require("./likeRouter");
const follow_router = require("./followRouter");
const notif_router = require("./notificationRouter");
const messaging_router = require("./messagingRouter");

router.get("/", IndexController.getIndexHome);
router.use("/users", user_router);
router.use("/profile", profile_router);
router.use("/posts", post_router);
router.use("/comments", comment_router);
router.use("/likes", like_router);
router.use("/follows", follow_router);
router.use("/notifications", notif_router);
router.use("/messages", messaging_router);

module.exports = router;