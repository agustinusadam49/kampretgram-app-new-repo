const { Users } = require("../models");
const { verifyToken } = require("../helpers/jwt");

function authentication(req, res, next) {
    let userToken = req.headers.token;
    try {
        let decoded = verifyToken(userToken);
        let userId = decoded.id;
        let userEmail = decoded.email;
        Users.findByPk(userId)
            .then(userData => {
                if (userData) {
                    req.userDataId = userId;
                    req.userDataEmail = userEmail;
                    next();
                } else if (!userData) {
                    throw {
                        status: "401 Unauthorized",
                        message: "You Must Login First to access this!",
                        code: 401
                    }
                }
            })
            .catch(err => {
                throw err;
            })
    } catch (err) {
        next(err);
    }
}

module.exports = authentication;