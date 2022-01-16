const router = require("express").Router();

const NotificationControllers = require("../controllers/notificationControllers");
const authentication = require("../middlewares/authentication");

router.get("/", authentication, NotificationControllers.getAllNotification);

module.exports = router;