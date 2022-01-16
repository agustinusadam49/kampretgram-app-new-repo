class IndexControllers {
    static getIndexHome(req, res, next) {
        res.status(200).json({
            status: "Ok!",
            message: "Masuk ke end-point index Home",
            code: 200
        })
    }
}

module.exports = IndexControllers;