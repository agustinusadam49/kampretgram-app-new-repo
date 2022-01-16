const router = require("express").Router();

const MessagingControllers = require("../controllers/messagingControllers");
const authentication = require("../middlewares/authentication");
const { authorizationMessage } = require("../middlewares/authorization");

router.post("/", authentication, MessagingControllers.createNewMessage);
router.get("/", authentication, MessagingControllers.getAllMessages);
router.get("/:id", authentication, authorizationMessage, MessagingControllers.getMessageById);
router.put("/:id", authentication, MessagingControllers.updateMessageById);
router.delete("/:id", authentication, authorizationMessage, MessagingControllers.deleteMessageById);

module.exports = router;