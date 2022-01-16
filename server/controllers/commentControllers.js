const { Comment, Users, Post } = require("../models");

class CommentControllers {
    static createNewComment(req, res, next) {
        let userId = req.userDataId;
        let newCommentObj = {
            PostId: req.body.PostId,
            UserId: userId,
            comments: req.body.comments
        }
        Comment.create(newCommentObj)
            .then(newCommentData => {
                res.status(201).json({
                    status: "Created!",
                    message: `User dengan ID: ${userId} berhasil menambahkan comment ke data post dengan ID: ${newCommentData.PostId}`,
                    comment_data: newCommentData,
                    code: 201
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllComment(req, res, next) {
        let userId = req.userDataId;
        let userEmail = req.userDataEmail;
        Comment.findAll({ where: { "UserId": userId }, include: { model: Post, include: { model: Users } }, order: [["id", "DESC"]] })
            .then(commentData => {
                if (commentData.length > 0) {
                    res.status(200).json({
                        status: "Ok!",
                        message: `user dengan email ${userEmail} memiliki comment sebanyak ${commentData.length}`,
                        comments: commentData,
                        code: 200
                    })
                } else if (commentData.length < 1) {
                    throw {
                        status: "Not Found",
                        message: "Anda tidak memiliki data comment",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getCommentById(req, res, next) {
        let commentId = req.params.id;
        Comment.findByPk(commentId, { include: [Users, Post] })
            .then(commentData => {
                if (commentData) {
                    res.status(200).json({
                        status: "Ok!",
                        comment: commentData,
                        code: 200
                    })
                } else if (!commentData) {
                    throw {
                        status: "Not Found",
                        message: `Data comment dengan ID: ${commentId} tidak ditemukan!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static updateOneComment(req, res, next) {
        let commentId = req.params.id;
        let userId = req.userDataId;
        let updatedCommentObj = {
            PostId: req.body.PostId,
            UserId: userId,
            comments: req.body.comments
        }
        Comment.update(updatedCommentObj, { where: { "id": commentId } })
            .then(updatedComment => {
                if (updatedComment == 1) {
                    res.status(201).json({
                        status: "201 Created/Updated!",
                        message: `Berhasil update data comment dengan ID: ${commentId}.`,
                        code: 201
                    })
                } else if (updatedComment == 0) {
                    throw {
                        status: "Not Found!",
                        message: `Data comment dengan ID: ${commentId} tidak ditemukan!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static deleteCommentById(req, res, next) {
        let commentId = req.params.id;
        Comment.destroy({ where: { "id": commentId } })
            .then(dataComment => {
                if (dataComment == 1) {
                    res.status(200).json({
                        status: "200 Ok!",
                        message: `Berhasil menghapus data comment dengan ID: ${commentId}.`,
                        code: 200
                    })
                } else if (dataComment == 0) {
                    throw {
                        status: "Not Found",
                        message: `Data comment dengan ID: ${commentId} tidak ditemukan!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = CommentControllers;