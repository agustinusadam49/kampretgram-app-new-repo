const router = require("express").Router();

const ProfileControllers = require("../controllers/profileControllers");

const authentication = require("../middlewares/authentication");
const { authorizationProfile } = require("../middlewares/authorization")

// Only admin can do this Create new one profile for one user
router.post("/", authentication, ProfileControllers.create);

// Read All profiles 
router.get("/", authentication, ProfileControllers.getAll);
router.get("/all-user-profile-data-login", authentication, ProfileControllers.getProfileUserLogin)

// Read one profile by id
router.get("/:id", authentication, ProfileControllers.getById);

// Update a user's profile
router.put("/:id", authentication, authorizationProfile, ProfileControllers.update);

// delete profile by id 
router.delete("/:id", authentication, authorizationProfile, ProfileControllers.deleteUserAccount);


module.exports = router;