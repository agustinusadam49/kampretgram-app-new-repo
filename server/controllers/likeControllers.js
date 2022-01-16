const { Like, Post, Users } = require("../models");

class LikeControllers {
    static addLike(req, res, next) {
        let userId = req.userDataId;
        let newLikeObj = {
            PostId: req.body.PostId,
            UserId: userId,
            status: req.body.status
        }
        Like.create(newLikeObj)
            .then(likeData => {
                res.status(201).json({
                    status: "Created!",
                    message: `User dengan ID: ${userId} berhasil like posting dengan ID: ${likeData.PostId}`,
                    like_data: likeData,
                    code: 201
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllLikes(req, res, next) {
        let userId = req.userDataId;
        Like.findAll({ where: { "UserId": userId }, include: { model: Post, include: { model: Users } }, order: [["id", "DESC"]] })
            .then(userLikes => {
                if (userLikes.length > 0) {
                    res.status(200).json({
                        status: "Ok!",
                        likes: userLikes,
                        code: 200
                    })
                } else if (userLikes < 1) {
                    throw {
                        status: "Not Found!",
                        message: "Anda belum like satupun postingan!",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static updateLikeById(req, res, next) {
        let likeId = req.params.id;
        let userId = req.userDataId;
        let updatedLikeObJ = {
            UserId: userId,
            id_delete: req.body.id_delete
        }
        Like.update(updatedLikeObJ, { where: { "id": likeId } })
            .then(result => {
                if (result == 1) {
                    res.status(201).json({
                        status: "Created/Updated!",
                        message: `Berhasil update data like dengan ID: ${likeId}`,
                        code: 201
                    })
                } else if (result == 0) {
                    throw {
                        status: 404,
                        message: `Data like dengan ID: ${likeId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .next(err => {
                next(err)
            })
    }

    static deleteLike(req, res, next) {
        let likeId = req.params.id;
        Like.destroy({ where: { "id": likeId } })
            .then(isDataDeleted => {
                if (isDataDeleted == 1) {
                    res.status(200).json({
                        status: "Ok!",
                        message: `Berhasil menghapus data like dengan ID: ${likeId}.`,
                        code: 200
                    })
                } else if (isDataDeleted == 0) {
                    throw {
                        status: "Not Found",
                        message: `Data Like dengan ID: ${likeId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = LikeControllers;