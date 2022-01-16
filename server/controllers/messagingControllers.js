const { Messaging, Profile, Users } = require("../models");

class MessagingControllers {
    static createNewMessage(req, res, next) {
        let userId = req.userDataId;
        let newMessageObj = {
            ProfileId: req.body.ProfileId,
            UserId: userId,
            chats: req.body.chats
        }
        Messaging.create(newMessageObj)
            .then(newMessageData => {
                res.status(201).json({
                    status: "Created!",
                    message_data: newMessageData,
                    code: 201
                })
            })
            .catch(err => {
                next(err)
            })
    }

    static getAllMessages(req, res, next) {
        // let userId = req.userDataId
        Messaging.findAll({ 
            // where: { "UserId": userId },
            include: { model: Users, include: { model: Profile } },
            order: [["id", "DESC"]] 
        })
            .then(messageData => {
                if (messageData.length > 0) {
                    res.status(200).json({
                        status: "Ok!",
                        messages: messageData,
                        code: 200
                    })
                } else if (messageData.length < 1) {
                    throw {
                        status: "Not Found!",
                        message: "Tidak ada data messages",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }


    static getMessageById(req, res, next) {
        let messageId = req.params.id;
        Messaging.findByPk(messageId, { include: [Users, Profile] })
            .then(messageData => {
                if (messageData) {
                    res.status(200).json({
                        status: "Ok!",
                        message: messageData,
                        code: 200
                    })
                } else if (!messageData) {
                    throw {
                        status: "Not Found!",
                        message: `Maaf data message dengan ID: ${messageId} tidak ditemukan!`,
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }

    static updateMessageById(req, res, next) {
        let messageId = req.params.id;
        let updatedMessageObj = {
            // ProfileId: req.body.ProfileId,
            // UserId: req.body.UserId,
            // chats: req.body.chats,
            read: req.body.read
        }
        Messaging.update(updatedMessageObj, { where: { "id": messageId } })
            .then(updatedMessage => {
                if (updatedMessage == 1) {
                    res.status(201).json({
                        status: "Created/Updated!",
                        message: `Berhasil update data Message dengan ID: ${messageId}`,
                        code: 201
                    })
                } else if (updatedMessage == 0) {
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

    static deleteMessageById(req, res, next) {
        let messageId = req.params.id;
        Messaging.destroy({ where: { "id": messageId } })
            .then(messageDataDeleted => {
                if (messageDataDeleted == 1) {
                    res.status(200).json({
                        status: "Ok!",
                        message: `Berhasil menghapus data Message dengan ID: ${messageId}`,
                        code: 200
                    })
                } else if (messageDataDeleted == 0) {
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
}

module.exports = MessagingControllers;