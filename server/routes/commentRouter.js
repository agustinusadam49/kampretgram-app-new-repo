const router = require("express").Router();

const CommentControllers = require("../controllers/commentControllers");
const authentication = require("../middlewares/authentication");
const { authorizationComment } = require("../middlewares/authorization")

router.post("/", authentication, CommentControllers.createNewComment);
router.get("/", authentication, CommentControllers.getAllComment);
router.get("/:id", authentication, authorizationComment, CommentControllers.getCommentById);
router.put("/:id", authentication, authorizationComment, CommentControllers.updateOneComment);
router.delete("/:id", authentication, authorizationComment, CommentControllers.deleteCommentById);

module.exports = router;