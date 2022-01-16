const router = require("express").Router();

const LikeControllers = require("../controllers/likeControllers");

const authentication = require("../middlewares/authentication")
// const {authorizationLike} = require("../middlewares/authorization");

router.post("/", authentication, LikeControllers.addLike);
router.get("/", authentication, LikeControllers.getAllLikes);
router.put("/:id", authentication,  LikeControllers.updateLikeById);
router.delete("/:id", authentication, LikeControllers.deleteLike);

module.exports = router;