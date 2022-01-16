const jwt = require("jsonwebtoken");

function generateToken(payload) {
    let token = jwt.sign(payload, process.env.SECRET || 'secret');
    return token
}

function verifyToken(userToken) {
    return jwt.verify(userToken, process.env.SECRET || 'secret');
}

module.exports = {
    generateToken,
    verifyToken
}