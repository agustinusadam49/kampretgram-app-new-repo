const bcrypt = require("bcryptjs");

function generatePassword(userPassword) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(userPassword, salt);
    return hash;
}

function checkPassword(userInputPassword, userPasswordInDatabase) {
    return bcrypt.compareSync(userInputPassword, userPasswordInDatabase);
}

module.exports = {
    generatePassword,
    checkPassword
}