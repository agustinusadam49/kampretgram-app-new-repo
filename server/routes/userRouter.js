const router = require("express").Router();

const UserControllers = require("../controllers/userControllers");

const authentication = require("../middlewares/authentication");
const isOnline = require("../middlewares/isOnline");

// Users
router.post("/register", UserControllers.register);
router.post("/login", isOnline, UserControllers.login);
router.get("/online", UserControllers.getAllUsersOnline);

// Admin
router.post("/", UserControllers.createNewUser);
router.get("/", authentication, UserControllers.getAllUsers);
router.get("/all-users-login-info", authentication, UserControllers.getAllUsersLoginInfo);
router.get("/edit-profile-user-login", authentication, UserControllers.getAllUsersForEditProfile);
router.get("/:id", authentication, UserControllers.getUserById);
router.get("/for-generate-messages/:id", authentication, UserControllers.getUserByIdToGenerateMessages);
router.put("/:id", authentication, UserControllers.updateUserById);
router.put("/logout/:id", authentication, UserControllers.updateLogout);
router.delete("/:id", UserControllers.deleteUserById);


module.exports = router;