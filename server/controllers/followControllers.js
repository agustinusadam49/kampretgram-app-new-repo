const { Following, Profile, Users } = require("../models");

class FollowControllers {
    static followSomeone(req, res, next) {
        let userId = req.userDataId;
        let newFollowDataObj = {
            ProfileId: req.body.ProfileId,
            UserId: userId,
            status: req.body.status,
        }

        Following.create(newFollowDataObj)
            .then(newDataFollow => {
                res.status(201).json({
                    status: "Created!",
                    message: `User dengan ID: ${userId} berhasil mem-follow user dengan profile ID: ${newDataFollow.ProfileId}`,
                    follow_data: newDataFollow,
                    code: 201
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllFollowingData(req, res, next) {
        let userId = req.userDataId
        Following.findAll({ where: { "UserId": userId }, include: { model: Profile, include: { model: Users } }, order: [["id", "DESC"]] })
            .then(dataFollows => {
                if (dataFollows.length > 0) {
                    res.status(200).json({
                        status: "Ok!",
                        follow_data: dataFollows,
                        code: 200
                    })
                } else if (dataFollows.length < 1) {
                    throw {
                        status: "Not Found!",
                        message: "Anda belum mengikuti siapapun!",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllFollowersData(req, res, next) {
        let userId = req.userDataId;
        Following.findAll({ where: { "ProfileId": userId }, include: { model: Users, include: { model: Profile } }, order: [["id", "DESC"]] })
            .then(followersData => {
                if (followersData.length > 0) {
                    res.status(200).json({
                        status: "Ok",
                        followers: followersData,
                        code: 200
                    })
                } else if (followersData.length < 1) {
                    throw {
                        status: "Not Found",
                        message: "Anda belum memiliki followers",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err);
            })
    }

    static deleteFollowing(req, res, next) {
        let followId = req.params.id;
        Following.destroy({ where: { "id": followId } })
            .then(deletedDataFollow => {
                if (deletedDataFollow == 1) {
                    res.status(200).json({
                        status: "Ok!",
                        message: `Berhasil menghapus data follow dengan ID: ${followId}`,
                        code: 200
                    })
                } else if (deletedDataFollow == 0) {
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

    static updateFollowById(req, res, next) {
        let followId = req.params.id;
        let userId = req.userDataId;
        let updatedFollowObj = {
            UserId: userId,
            id_delete_follow: req.body.id_delete_follow
        }
        Following.update(updatedFollowObj, { where: { "id": followId } })
            .then(updateResult => {
                if (updateResult == 1) {
                    res.status(201).json({
                        status: "Created/Updated!",
                        message: `Berhasil update data follow dengna ID: ${followId}`,
                        code: 201
                    })
                } else if (updateResult == 0) {
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
}

module.exports = FollowControllers;