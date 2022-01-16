const { 
    Post, 
    Users, 
    Comment, 
    Like, 
    Profile, 
    Following, 
    Notification 
} = require("../models");

class PostControllers {
    static createNewPost(req, res, next) {
        console.log("Data req.file =========================");
        console.log(req.file);
        let userDataFollower = null;
        let postId = null;
        let userId = req.userDataId;
        let newPostObj = {
            caption: req.body.caption,
            image_url: req.body.image_url,
            UserId: userId,
            like: 0,
            dis_like: 0
        }
        Post.create(newPostObj)
            .then(newPostData => {
                postId = newPostData.id;
                res.status(201).json({
                    status: "201 Created!",
                    message: `Berhasil menambahkan post data dengan caption: ${newPostData.caption}`,
                    post: newPostData
                })
                return Following.findAll({ where: { "ProfileId": userId } })
            })
            .then(userFollowerData => {
                userDataFollower = userFollowerData;
                if (userDataFollower.length > 0) {
                    for (let i = 0; i < userDataFollower.length; i++) {
                        let newNotifObj = {
                            PostId: postId,
                            UserId: userDataFollower[i].UserId,
                            status: 1,
                            id_delete: 0
                        }
                        Notification.create(newNotifObj)
                            .then(newNotifData => {
                                res.status(201).json({
                                    status: "Created!",
                                    message: "Berhasil membuat notifikasi baru",
                                    notif: newNotifData,
                                    code: 201
                                })
                            })
                            .catch(err => {
                                next(err)
                            })
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllPosts(req, res, next) {
        Post.findAll({ include: { model: Users, include: Profile }, order: [["id", "DESC"]] })
            .then(postData => {
                if (postData.length > 0) {
                    res.status(200).json({
                        status: "200 Ok!",
                        jumlah_seluruh_postingan_users: postData.length,
                        posts: postData
                    })
                } else if (postData.length < 1) {
                    throw {
                        status: "404 Not Found",
                        message: "Belum Ada Postingan, silahkan tambah postingan Anda!",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllUserLoginPosts(req, res, next) {
        let userId = req.userDataId;
        Post.findAll({ where: { "UserId": userId }, include: { model: Like, include: { model: Users, include: { model: Profile } } }, order: [["id", "DESC"]] })
            .then(postDataUserLogin => {
                if (postDataUserLogin.length > 0) {
                    res.status(200).json({
                        status: "200 Ok!",
                        jumlah_postingan: postDataUserLogin.length,
                        posts: postDataUserLogin,
                        code: 200
                    })
                } else if (postDataUserLogin.length < 1) {
                    throw {
                        status: "404 Not Found",
                        message: "Anda belum memposting apapun",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getPostById(req, res, next) {
        let postId = req.params.id;
        let dataPostById = null;
        let dataCommentById = null
        Post.findByPk(postId)
            .then(postDataById => {
                if (postDataById === null) {
                    throw {
                        status: "404 Not Found",
                        message: `Data post dengan ID: ${postId} tidak ada!`,
                        code: 404
                    }
                } else {
                    dataPostById = postDataById;
                    return Comment.findAll({ include: { model: Users, include: { model: Profile } }, where: { "PostId": postId }, order: [["id", "DESC"]] })
                }
            })
            .then(dataComment => {
                dataCommentById = dataComment;
                return Like.findAll({ where: { "PostId": postId }, include: { model: Users, include: { model: Profile } } })
            })
            .then(dataLikes => {
                res.status(200).json({
                    status: "Ok!",
                    post: dataPostById,
                    comments: dataCommentById,
                    jumlah_likes: dataLikes.length,
                    likes: dataLikes
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static updatePostById(req, res, next) {
        let postId = req.params.id;
        let userId = req.userDataId;
        let updatedPostObj = {
            caption: req.body.caption,
            image_url: req.body.image_url,
            UserId: userId,
            like: req.body.like,
            dis_like: req.body.dis_like
        }
        Post.update(updatedPostObj, { where: { "id": postId } })
            .then(postData => {
                if (postData == 1) {
                    res.status(201).json({
                        status: "201 Created/Updated!",
                        message: `Berhasil meng-edit data post dengan ID: ${postId}`,
                        code: 201
                    })
                } else if (postData == 0) {
                    throw {
                        status: "404 Not Found",
                        message: `Data post dengan ID: ${postId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static deletePostById(req, res, next) {
        let postId = req.params.id;
        Post.destroy({ where: { "id": postId } })
            .then(deletedPostData => {
                if (deletedPostData == 1) {
                    res.status(200).json({
                        status: "200 Ok!",
                        message: `Berhasil menghapus data post dengan ID: ${postId}`,
                        code: 200
                    })
                    return Notification.destroy({ where: { "PostId": postId } })
                } else if (deletedPostData == 0) {
                    throw {
                        status: "404 Not Found",
                        message: `Data post dengan ID: ${postId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .then(deletedNotif => {
                if (deletedNotif == 1) {
                    res.status(200).json({
                        status: "200 Ok!",
                        message: `Berhasil menghapus notifikasi dengan PostId: ${postId}`,
                        code: 200
                    })
                } else if (deletedNotif == 0) {
                    throw {
                        status: "Not Found!",
                        message: `Data notifikasi dengan PostId: ${postId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static updateLike(req, res, next) {
        let postId = req.params.id
        let updatedLikeObj = {
            like: req.body.like
        }
        Post.update(updatedLikeObj, { where: { "id": postId } })
            .then(updatedLike => {
                if (updatedLike == 1) {
                    res.status(201).json({
                        status: "Created/Updated!",
                        message: `Berhasil update like dengan data Post ID: ${postId}.`,
                        code: 201
                    })
                } else if (updatedLike == 0) {
                    throw {
                        status: "Not Found!",
                        message: `Data like di POST dengan ID: ${postId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static updateLikeToZero(req, res, next) {
        let updateLikeObj = {
            like: req.body.like
        }
        Post.update(updateLikeObj, { where: { "like": 1 } })
            .then(result => {
                if (result == 1) {
                    res.status(201).json({
                        status: "Created/Updated",
                        message: "Success edit like to 0",
                        code: 201
                    })
                } else if (result == 0) {
                    res.status(404).json({
                        status: "Not Found!",
                        message: "Error edit like to 0",
                        code: 404
                    })
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static updateDislike(req, res, next) {
        let postId = req.params.id
        let updatedDislikeObj = {
            dis_like: req.body.dis_like
        }
        Post.update(updatedDislikeObj, { where: { "id": postId } })
            .then(updatedDisLike => {
                if (updatedDisLike == 1) {
                    res.status(201).json({
                        status: "Created/Updated!",
                        message: `Berhasil update dislike dengan data Post ID: ${postId}.`,
                        code: 201
                    })
                } else if (updatedDisLike == 0) {
                    throw {
                        status: "Not Found!",
                        message: `Data dislike di POST dengan ID: ${postId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = PostControllers;