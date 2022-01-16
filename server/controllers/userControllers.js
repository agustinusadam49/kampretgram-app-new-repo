const { Users, Profile, Post, Comment, Like, Following, Messaging } = require("../models");

const { checkPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserControllers {
    static register(req, res, next) {
        let newUserEmail = req.body.email;
        let newUserTemp = null;
        Users.findOne({ where: { "email": newUserEmail } })
            .then(userDataEmail => {
                if (userDataEmail) {
                    throw {
                        status: "Unauthorized!",
                        message: `Maaf email: ${newUserEmail} telah digunakan!`,
                        code: 401
                    }
                } else if (!userDataEmail) {
                    let newUserObj = {
                        full_name: req.body.full_name,
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password
                    }
                    return Users.create(newUserObj)
                }
            })
            .then(newUserData => {
                newUserTemp = newUserData
                let newProfileObj = {
                    avatar_url: "",
                    status: "no status yet",
                    phone_number: 23456,
                    UserId: newUserTemp.id
                }
                return Profile.create(newProfileObj)
            })
            .then(newUserProfile => {
                let token = generateToken({
                    id: newUserTemp.id,
                    email: newUserTemp.email,
                    password: newUserTemp.password
                })
                res.status(201).json({
                    status: "201 Created!",
                    message: `Berhasil menambahkan user baru dengan nama: ${newUserTemp.full_name}`,
                    user: newUserTemp,
                    user_token: token,
                    user_name: newUserTemp.username,
                    user_id: newUserTemp.id,
                    user_profile: newUserProfile
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static login(req, res, next) {
        let userEmail = req.body.email;
        let userPassword = req.body.password;
        let dataUser = null;
        Users.findOne({ where: { "email": userEmail } })
            .then(userData => {
                if (userData) {
                    let compare = checkPassword(userPassword, userData.password)
                    if (compare == true) {
                        dataUser = userData;
                        return Users.update({ is_online: 1 }, { where: { "id": dataUser.id } })
                    } else if (compare == false) {
                        throw {
                            status: "401 Unauthorized",
                            message: "Maaf password yang anda masukan salah! Atau registrasi jika anda belum memiliki akun",
                            code: 401
                        }
                    }
                } else if (!userData) {
                    throw {
                        status: "401 Unauthorized",
                        message: "Maaf email yang anda masukan salah! Atau registrasi jika anda belum memiliki akun!",
                        code: 401
                    }
                }
            })
            .then(updatedUserData => {
                if (updatedUserData == 1) {
                    let userToken = generateToken({
                        id: dataUser.id,
                        email: dataUser.email,
                        password: dataUser.password
                    })
                    res.status(200).json({
                        status: "200 Ok!",
                        user_token: userToken,
                        user_name: dataUser.username,
                        user_id: dataUser.id,
                    })
                } else if (updatedUserData == 0) {
                    throw {
                        status: "404 Not Found",
                        message: "Data user tidak ada",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllUsers(req, res, next) {
        // let userId = req.userDataId;
        // , where: { "id": userId }
        Users.findAll({ include: [Profile, Like], order: [["id", "DESC"]] })
            .then(dataUsers => {
                if (dataUsers.length > 0) {
                    res.status(200).json({
                        status: "200 Ok",
                        message: `Jumlah seluruh users kampretgram adalah sebanyak: ${dataUsers.length} orang`,
                        users: dataUsers
                    })
                } else if (dataUsers.length < 1) {
                    throw {
                        status: "404 Not Found!",
                        message: "Belum ada data users sama sekali!",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllUsersLoginInfo(req, res, next) {
        let userId = req.userDataId;
        let userDataProfile = null;
        let userDataPost = null;
        let userDataLike = null;
        let userDataComment = null;
        let userDataFollow = null;
        let userDataFollower = null;
        Users.findAll({ where: { "id": userId }, include: { model: Profile } })
            .then(userData => {
                userDataProfile = userData;
                return Post.findAll({ where: { "UserId": userId }, order: [["id", "DESC"]] })
            })
            .then(userPostData => {
                userDataPost = userPostData;
                return Like.findAll({ where: { "UserId": userId }, order: [["id", "DESC"]] })
            })
            .then(userLikeData => {
                userDataLike = userLikeData;
                return Comment.findAll({ where: { "UserId": userId }, order: [["id", "DESC"]] })
            })
            .then(userCommentData => {
                userDataComment = userCommentData;
                return Following.findAll({ where: { "UserId": userId }, order: [["id", "DESC"]] })
            })
            .then(userFollowData => {
                userDataFollow = userFollowData;
                return Following.findAll({ where: { "ProfileId": userId }, order: [["id", "DESC"]] })
            })
            .then(userFollowerData => {
                userDataFollower = userFollowerData
                res.status(200).json({
                    status: "Ok",
                    code: 200,
                    user: userDataProfile,
                    post: userDataPost,
                    like: userDataLike,
                    comment: userDataComment,
                    following_to: userDataFollow,
                    followed_by: userDataFollower
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static getUserById(req, res, next) {
        let userLogin = req.userDataId;
        let userId = req.params.id;
        let dataUserTemp = null;
        let dataUserProfile = null;
        let dataUserPosting = null;
        let jumlahFollowers = null;
        let jumlahMengikuti = null;
        let dataPostUser = null;
        let dataFollowers = null;
        let postBeingLiked = null;
        let followingData = null;
        let dataMessageSent = null;
        let dataMessageComeIn = null;
        Users.findByPk(userId)
            .then(dataUser => {
                if (dataUser) {
                    dataUserTemp = dataUser;
                    return Profile.findOne({ where: { "UserId": userId }, include: { model: Following, include: { model: Users, include: { model: Profile } } }, order: [["id", "DESC"]] })
                } else if (!dataUser) {
                    throw {
                        status: "404 Not Found!",
                        message: `Maaf user dengan ID: ${userId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .then(dataProfile => {
                dataUserProfile = dataProfile;
                jumlahFollowers = dataProfile.Followings.length;
                dataFollowers = dataProfile.Followings;
                console.log(dataProfile.Followings.length);
                return Post.findAll({ where: { "UserId": userId }, include: { model: Users }, order: [["id", "DESC"]] })
            })
            .then(userPostingData => {
                dataUserPosting = userPostingData.length;
                dataPostUser = userPostingData;
                return Following.findAll({ where: { "UserId": userId }, include: { model: Profile, include: { model: Users } }, order: [["id", "DESC"]] })
            })
            .then(dataFollowing => {
                jumlahMengikuti = dataFollowing.length
                followingData = dataFollowing
                return Like.findAll({ where: { "UserId": userId }, include: { model: Post, include: { model: Users } }, order: [["id", "DESC"]] })
            })
            .then(dataPostLike => {
                postBeingLiked = dataPostLike;
                return Messaging.findAll({ where: { "ProfileId": userLogin }, include: { model: Users, include: { model: Profile } }, order: [["id", "DESC"]] })
            })
            .then(messagingData => {
                dataMessageSent = messagingData
                return Messaging.findAll({ where: { "UserId": userLogin }, include: { model: Users, include: { model: Profile } }, order: [["id", "DESC"]] })
            })
            .then(messageCome => {
                dataMessageComeIn = messageCome;
                res.status(200).json({
                    status: "200 Ok!",
                    user: dataUserTemp,
                    profile: dataUserProfile,
                    jumlah_followers: jumlahFollowers,
                    jumlah_postingan: dataUserPosting,
                    jumlah_mengikuti: jumlahMengikuti,
                    posts: dataPostUser,
                    likes: postBeingLiked,
                    followers: dataFollowers,
                    following: followingData,
                    messages: dataMessageSent,
                    messages_in: dataMessageComeIn
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static getUserByIdToGenerateMessages(req, res, next) {
        let userId = req.params.id;
        let userLogin = req.userDataId;
        let dataMessageSent = null;
        Users.findByPk(userId)
            .then(userById => {
                if (userById) {
                    return Messaging.findAll({ where: { "ProfileId": userLogin }, include: { model: Users, include: { model: Profile } }, order: [["id", "DESC"]] })
                } else if (!userById) {
                    throw {
                        status: "Not Found!",
                        message: `Maaf data user dengan Id: ${userId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .then(messagingDataSent => {
                dataMessageSent = messagingDataSent;
                res.status(200).json({
                    status: "Ok!",
                    pesan_terkirim: dataMessageSent,
                    code: 200
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static createNewUser(req, res, next) {
        let userEmail = req.body.email;
        let newUserTemp = null;
        Users.findOne({ where: { "email": userEmail } })
            .then(userDataByEmail => {
                if (userDataByEmail) {
                    throw {
                        status: "401 Unauthorized!",
                        message: `Maaf email ${userEmail} telah digunakan`,
                        code: 401
                    }
                } else if (!userDataByEmail) {
                    let newUserObj = {
                        full_name: req.body.full_name,
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password
                    }
                    return Users.create(newUserObj)
                }
            })
            .then(newUser => {
                newUserTemp = newUser;
                let newProfileObj = {
                    avatar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTFnG0huY6whcqQtmgJDP7XgSb8VCpmLUnKXw&usqp=CAU",
                    status: "no status yet",
                    phone_number: 23456,
                    UserId: newUserTemp.id
                }
                return Profile.create(newProfileObj)

            })
            .then(newUserProfile => {
                res.status(201).json({
                    status: "201 Created!",
                    message: `Berhasil menambahkan user baru dengan nama: ${newUserTemp.full_name}`,
                    user: newUserTemp,
                    user_profile: newUserProfile
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static updateUserById(req, res, next) {
        let userId = req.params.id;
        let updatedUserObj = {
            full_name: req.body.full_name,
            username: req.body.username,
            email: req.body.email
        }
        Users.update(updatedUserObj, { where: { "id": userId } })
            .then(updatedUser => {
                if (updatedUser == 1) {
                    let updatedProfileObj = {
                        avatar_url: req.body.avatar_url,
                        status: req.body.status,
                        phone_number: req.body.phone_number
                    }
                    return Profile.update(updatedProfileObj, { where: { "UserId": userId } })
                } else if (updatedUser == 0) {
                    throw {
                        status: "404 Not Found",
                        message: `Data user dengan ID: ${userId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .then(updatedUserProfile => {
                if (updatedUserProfile == 1) {
                    res.status(201).json({
                        status: "201 Created/Updated!",
                        message: `Berhasil update user dan profilenya dengan ID: ${userId}`,
                        code: 201
                    })
                } else if (updatedUserProfile == 0) {
                    throw {
                        status: "404 Not Found",
                        message: `Data profile dengan ID: ${userId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static deleteUserById(req, res, next) {
        let userId = req.params.id;
        Users.destroy({ where: { "id": userId } })
            .then(deletedUser => {
                if (deletedUser == 0) {
                    throw {
                        status: "404 Not Found",
                        message: `Data user dengan ID: ${userId} tidak ada!`,
                        code: 404
                    }
                } else if (deletedUser == 1) {
                    return Profile.destroy({ where: { "UserId": userId } })
                }
            })
            .then(deletedProfile => {
                if (deletedProfile == 1) {
                    return Post.destroy({ where: { "UserId": userId } });
                } else if (deletedProfile == 0) {
                    throw {
                        status: "404 Not Found!",
                        message: `Data profile dengan UserId: ${userId} tidak ada`,
                        code: 404
                    }
                }
            })
            .then(deletedPost => {
                console.log(deletedPost);
                return Messaging.destroy({ where: { "UserId": userId } })
            })
            .then(deletedMessaging => {
                console.log(deletedMessaging);
                return Like.destroy({ where: { "UserId": userId } })
            })
            .then(deletedLike => {
                console.log(deletedLike);
                return Following.destroy({ where: { "UserId": userId } })
            })
            .then(deletedFollowing => {
                console.log(deletedFollowing);
                return Comment.destroy({ where: { "UserId": userId } })
            })
            .then(deletedComment => {
                console.log(deletedComment);
                return Following.destroy({ where: { "ProfileId": userId } })
            })
            .then(deletedFollower => {
                console.log(deletedFollower);
                res.status(200).json({
                    status: "200 Ok!",
                    message: `Berhasil menghapus seluruh data user dengan ID: ${userId} dan seluruh data yang berkaitan dengan user tersebut!`,
                    code: 200
                })

            })
            .catch(err => {
                next(err)
            })
    }

    static getAllUsersForEditProfile(req, res, next) {
        let userId = req.userDataId;
        Users.findAll({ order: [["id", "DESC"]], where: { "id": userId }, include: { model: Profile } })
            .then(dataUsers => {
                if (dataUsers.length > 0) {
                    res.status(200).json({
                        status: "200 Ok",
                        message: `Jumlah seluruh users kampretgram adalah sebanyak: ${dataUsers.length} orang`,
                        users: dataUsers
                    })
                } else if (dataUsers.length < 1) {
                    throw {
                        status: "404 Not Found!",
                        message: "Belum ada data users sama sekali!",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static updateLogout(req, res, next) {
        let userId = req.userDataId;
        let updateIsOnlineObj = {
            is_online: req.body.is_online
        }
        Users.update(updateIsOnlineObj, { where: { "id": userId } })
            .then(updatedUserOnlineData => {
                if (updatedUserOnlineData == 1) {
                    res.status(201).json({
                        status: "Updated!",
                        message: `Berhasil update is_online di data user dengan id: ${userId}`,
                        code: 201
                    })
                } else if (updatedUserOnlineData == 0) {
                    throw {
                        status: "Not Found!",
                        message: `Maaf data user dengan id: ${userId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllUsersOnline(req, res, next) {
        let onlineStatus = 1;
        Users.findAll({ where: { "is_online": onlineStatus }, include: { model: Profile }, order: [["id", "DESC"]] })
            .then(allUsersOnline => {
                if (allUsersOnline.length > 0) {
                    res.status(200).json({
                        status: "Ok!",
                        users_online: allUsersOnline,
                        code: 200
                    })
                } else if (allUsersOnline.length < 1) {
                    throw {
                        status: "Not Found!",
                        message: "Tidak ada users yang online saat ini",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = UserControllers;