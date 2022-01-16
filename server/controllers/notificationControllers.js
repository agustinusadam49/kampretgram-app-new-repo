const { Notification, Post, Users } = require("../models");

class NotificationControllers {
    static getAllNotification(req, res, next) {
        let userId = req.userDataId;
        Notification.findAll({ where: { "UserId": userId }, include: { model: Post, include: { model: Users } }, order: [["id", "DESC"]] })
            .then(notificationData => {
                if (notificationData.length > 0) {
                    res.status(200).json({
                        status: "Ok!",
                        jumlah_notifikasi: notificationData.length,
                        notifications: notificationData,
                        code: 200
                    })
                } else if (notificationData.length < 1) {
                    throw {
                        status: "Not Found!",
                        message: "Belum ada notifikasi",
                        code: 404
                    }
                }
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = NotificationControllers;