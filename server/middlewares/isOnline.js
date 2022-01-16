// Belum digunakan (pengecekan harus melalui database)
// User yang online harus dimasukan ke database.

const { Users } = require("../models");

function isOnline(req, res, next) {
    let userEmail = req.body.email;
    Users.findOne({ where: { "email": userEmail } })
        .then(userData => {
            if (userData) {
                if (userData.is_online == 1) {
                    throw {
                        status: "Un Authorized!",
                        message: "Maaf anda sudah online dengan akun ini",
                        code: 401
                    }
                } else if (userData.is_online == 0) {
                    next();
                }
            } else if (!userData) {
                throw {
                    status: "Not Found!",
                    message: `Maaf data user dengan email: ${userEmail} tidak dapat ditemukan`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err);
        })
}

module.exports = isOnline;