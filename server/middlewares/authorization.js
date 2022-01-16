const { Post, Profile, Comment, Like, Following, Chat, Message, Users } = require("../models");

function authorizationPost(req, res, next) {
    let postId = req.params.id;
    Post.findByPk(postId)
        .then(postData => {
            if (postData) {
                if (postData.UserId == req.userDataId) {
                    next();
                } else {
                    throw {
                        status: "401 Unauthorized!",
                        message: `Maaf data post dengan ID: ${postId} bukan milik Anda!`,
                        code: 401
                    }
                }
            } else if (!postData) {
                throw {
                    status: "404 Not Found!",
                    message: `Maaf data post dengan ID: ${postId} tidak ditemukan!`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err);
        })
}

function authorizationProfile(req, res, next) {
    let profileId = req.params.id;
    Profile.findByPk(profileId)
        .then(profileData => {
            if (profileData) {
                if (profileData.UserId == req.userDataId) {
                    next();
                } else if (profileData.UserId != req.userDataId) {
                    throw {
                        status: "401 Unauthorized",
                        message: `Data profile dengan ID: ${profileId} bukan milik anda`,
                        code: 401
                    }
                }
            } else if (!profileData) {
                throw {
                    status: "404 Not Found",
                    message: `Data profile dengan ID: ${profileId} tidak ada`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err)
        })
}

function authorizationComment(req, res, next) {
    let commentId = req.params.id;
    Comment.findByPk(commentId)
        .then(commentData => {
            if (commentData) {
                if (commentData.UserId == req.userDataId) {
                    next();
                } else {
                    throw {
                        status: "401 Unauthorized!",
                        message: `Data comment dengan ID: ${commentId} bukan milik anda!`,
                        code: 401
                    }
                }
            } else if (!commentData) {
                throw {
                    status: "404 Not Found!",
                    message: `Data comment dengan ID: ${commentId} tidak ada!`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err)
        })
}

function authorizationLike(req, res, next) {
    let like_id = req.params.id;
    Like.findByPk(like_id)
        .then(likeData => {
            if (likeData) {
                if (likeData.UserId == req.userDataId) {
                    next();
                } else {
                    throw {
                        status: "Un Authorized!",
                        message: `Maaf data like dengan ID: ${like_id} bukan milik anda!`,
                        code: 401
                    }
                }

            } else if (!likeData) {
                throw {
                    status: "Not Found!",
                    message: `Maaf data like dengan ID: ${like_id} tidak ada!`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err)
        })
}

function authorizationFollow(req, res, next) {
    let followId = req.params.id;
    Following.findByPk(followId)
        .then(dataFollow => {
            if (dataFollow) {
                if (dataFollow.user_follow_to == req.userDataId) {
                    next();
                } else {
                    throw {
                        status: "Un Authorized!",
                        message: `Maaf data follow dengan ID: ${followId} bukan milik anda!`,
                        code: 401
                    }
                }
            } else if (!dataFollow) {
                throw {
                    status: "Not Found!",
                    message: `Maaf data follow dengan ID: ${followId} tidak ditemukan!`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err)
        })
}

function authorizationChat(req, res, next) {
    let chatId = req.params.id;
    Chat.findByPk(chatId)
        .then(chatDataById => {
            if (chatDataById) {
                if (chatDataById.UserId == req.userDataId) {
                    next()
                } else {
                    throw {
                        status: "Un Authorized!",
                        message: `Maaf data Chat dengan ID: ${chatId} bukan milik anda!`,
                        code: 401
                    }
                }
            } else if (!chatDataById) {
                throw {
                    status: "Not Found!",
                    message: `Maaf data Chat dengan ID: ${chatId} tidak ditemukan!`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err)
        })
}

function authorizationMessage(req, res, next) {
    let messageId = req.params.id;
    Message.findByPk(messageId)
        .then(messageDataById => {
            if (messageDataById) {
                if (messageDataById.UserId == req.userDataId) {
                    next()
                } else {
                    throw {
                        status: "Un Authorized!",
                        message: `Maaf data Message dengan ID: ${messageId} bukan milik anda!`,
                        code: 401
                    }
                }
            } else if (!messageDataById) {
                throw {
                    status: "Not Found!",
                    message: `Maaf data Message dengan ID: ${messageId} tidak ditemukan!`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err)
        })
}

function authorizationUsers(req, res, next) {
    let userId = req.params.id;
    Users.findByPk(userId)
        .then(dataUserById => {
            if (dataUserById) {
                if (dataUserById.id == req.userDataId) {
                    next();
                } else {
                    throw {
                        status: "Un Authorized!",
                        message: `Maaf data user dengan ID: ${userId} bukan data anda!`,
                        code: 401
                    }
                }
            } else if (!dataUserById) {
                throw {
                    status: "Not Found!",
                    message: `Maaf data User dengan ID: ${userId} tidak ditemukan!`,
                    code: 404
                }
            }
        })
        .catch(err => {
            next(err)
        })
}

module.exports = {
    authorizationPost,
    authorizationProfile,
    authorizationComment,
    authorizationLike,
    authorizationFollow,
    authorizationChat,
    authorizationMessage,
    authorizationUsers
};