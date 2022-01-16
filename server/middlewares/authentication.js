const { Users } = require("../models");
const { verifyToken } = require("../helpers/jwt");

function authentication(req, res, next) {
    const userToken = req.headers.token;
    try {
        const decoded = verifyToken(userToken);
        if (decoded) {
            const userId = decoded.id;
            const userEmail = decoded.email;
            Users.findByPk(userId)
                .then(userDataById => {
                    if (userDataById) {
                        req.userDataId = userId;
                        req.userDataEmail = userEmail;
                        next()
                    } else if (!userDataById) {
                        throw {
                            status: "401 Unauthorized!",
                            message: "This user has been deleted from DB",
                            code: 401
                        }
                    }
                })
                .catch(err => {
                    next(err);
                })
        } else if (!decoded) {
            throw {
                status: "401 Unauthorized!",
                message: "User must login or register first!",
                code: 401
            }
        }
    } catch (err) {
        next(err);
    }
}

module.exports = authentication;