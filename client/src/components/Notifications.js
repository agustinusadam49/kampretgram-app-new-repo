import React, { useState, useEffect } from 'react';
import "./Notifications.css"

function Notifications({ yourNotifications, ifThereNotNotif }) {
    const [notificationData, setNotificationData] = useState(yourNotifications);
    const [ifNotifEmpty, setIfNotifEmpty] = useState(ifThereNotNotif);

    const showNotificationTable = () => {
        if (notificationData.length === 0) {
            return (
                <h5 className="notification__text__if__notif__empty">{ifNotifEmpty}</h5>
            )
        } else if (notificationData.length > 0) {
            return (
                <table border="1" className="notif__table">
                    <thead>
                        <tr>
                            <th className="notification__th__user">User</th>
                            <th>Image</th>
                            <th>Caption</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            notificationData.map(notif => {
                                return (
                                    <tr key={notif.id}>
                                        <td>{notif.Post.User.username}</td>
                                        <td>
                                            <img
                                                className="notification__image"
                                                src={notif.Post.image_url}
                                                alt=""
                                            />
                                        </td>
                                        <td>{notif.Post.caption}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            )
        }
    }

    useEffect(() => {
        setNotificationData(yourNotifications);
        setIfNotifEmpty(ifThereNotNotif);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yourNotifications, ifThereNotNotif])

    return (
        <div className="notifications__table">
            <p className="notification__text__title"><strong>Postingan User Yang Anda Follow</strong></p>

            {showNotificationTable()}
        </div>
    )
}

export default Notifications;
