function errorHandlers(err, req, res, next) {
    console.log("=============== Error yang belum dideteksi (batas atas) ===============");
    console.log(err.name);
    console.log(err);
    console.log("=============== Error yang belum dideteksi (batas bawah) ===============");
    if (err.name == "JsonWebTokenError") {
        res.status(401).json({
            status: "Unauthorized",
            message: "Please Login First!",
            code: 401
        })
    } else if (err.name == "SequelizeValidationError") {
        res.status(400).json({
            status: "400 Bad Reques!",
            errorMessage: err.errors[0].message,
            code: 400
        })
    } else if (err.name == "SequelizeDatabaseError") {
        res.status(500).json({
            status: "500 Internal Server Error",
            errors: err.parent
        })
    } else if (err.code != 500) {
        res.status(err.code).json({
            errors: err
        })
    } else {
        res.status(500).json({
            status: "500 Internal Server Error!",
            errors: err
        })
    }
}

module.exports = errorHandlers;