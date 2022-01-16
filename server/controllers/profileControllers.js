const { Profile, Users } = require("../models");

class ProfileControllers {
    static create(req, res, next) {
        let userId = req.userDataId;
        let newProfileObj = {
            avatar_url: req.body.avatar_url,
            status: req.body.status,
            phone_number: req.body.phone_number,
            UserId: userId
        }
        Profile.create(newProfileObj)
            .then(profileData => {
                res.status(201).json({
                    status: "201 Created!",
                    message: `Berhasil menambahkan profiles dengan UserId ${profileData.UserId}`,
                    new_profile: profileData
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static getAll(req, res, next) {
        Profile.findAll({ include: Users })
            .then(profileData => {
                if (profileData) {
                    res.status(200).json({
                        status: "200 Ok!",
                        profile: profileData
                    })
                } else if (!profileData) {
                    throw {
                        status: "404 Not Found",
                        message: "Tidak ada data apapun!",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getProfileUserLogin(req, res, next) {
        let userId = req.userDataId;
        Profile.findAll({ where: { "UserId": userId } })
            .then(dataProfile => {
                if (dataProfile) {
                    res.status(200).json({
                        status: "200 Ok!",
                        profile: dataProfile,
                    })
                } else if (!dataProfile) {
                    throw {
                        status: "404 Not Found",
                        message: "Tidak ada data apapun!",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static getById(req, res, next) {
        let profileId = req.params.id;
        Profile.findOne({ where: { "id": profileId }, include: Users })
            .then(profileData => {
                if (profileData) {
                    res.status(200).json({
                        status: "200 Ok!",
                        profile: profileData
                    })
                } else if (!profileData) {
                    throw {
                        status: "404 Not Found",
                        message: `Data profile dengan ID: ${profileId} tidak ada!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static update(req, res, next) {
        let profileId = req.params.id;
        let userId = req.userDataId;
        let updatedProfileObj = {
            avatar_url: req.body.avatar_url,
            status: req.body.status,
            phone_number: req.body.phone_number,
            UserId: userId
        }
        Profile.update(updatedProfileObj, { where: { "id": profileId } })
            .then(updatedProfile => {
                if (updatedProfile == 0) {
                    throw {
                        status: "404 Not Found",
                        message: `Data profile dengan ID: ${profileId} tidak ada!`,
                        code: 404
                    }
                } else if (updatedProfile == 1) {
                    res.status(201).json({
                        status: "201 Created/Updated!",
                        message: `Berhasil meng-edit profile dengan ID: ${profileId}`,
                        code: 201
                    })
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static deleteUserAccount(req, res, next) {
        let profileId = req.params.id;
        let userId = req.userDataId;
        Profile.destroy({ where: { "id": profileId } })
            .then(deletedAccount => {
                if (deletedAccount == 0) {
                    throw {
                        status: "404 Not Found!",
                        message: `Data profile dengan ID: ${profileId} tidak ada`,
                        code: 404
                    }
                } else if (deletedAccount == 1) {
                    return Users.destroy({ where: { "id": userId } })
                }
            })
            .then(allDeleted => {
                if (allDeleted == 0) {
                    throw {
                        status: "404 Not Found!",
                        message: `Data user dengan ID: ${userId} tidak ada`,
                        code: 404
                    }
                } else if (allDeleted == 1) {
                    res.status(200).json({
                        status: "200 Ok!",
                        message: `Berhasil menghapus account anda!`
                    })
                }
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = ProfileControllers;