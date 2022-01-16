const router = require("express").Router();

const FollowControllers = require("../controllers/followControllers");

const authentication = require("../middlewares/authentication");

router.post("/", authentication, FollowControllers.followSomeone);
router.get("/", authentication, FollowControllers.getAllFollowingData);
router.get("/followers", authentication, FollowControllers.getAllFollowersData);
router.put("/:id", authentication, FollowControllers.updateFollowById);
router.delete("/:id", authentication, FollowControllers.deleteFollowing);

module.exports = router;