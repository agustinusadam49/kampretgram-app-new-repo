const jwt = require("jsonwebtoken");

function generateToken(payload) {
    let token = jwt.sign(payload, process.env.SECRET);
    return token
}

function verifyToken(userToken) {
    return jwt.verify(userToken, process.env.SECRET);
}

module.exports = {
    generateToken,
    verifyToken
}