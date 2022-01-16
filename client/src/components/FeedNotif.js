import React, { useState, useEffect } from 'react';
import "./FeedNotif.css";
import socket from "../config/socket";

function FeedNotif() {
    const [otherUsersCreatePost, setOtherUserCreatePost] = useState(null);

    const showNotificationUserCreateNewPost = () => {
        if (otherUsersCreatePost !== null) {
            return <p className="feed__other__user__create__post">Notifikasi: <strong>{otherUsersCreatePost}</strong>, baru saja membuat postingan baru!</p>
        } else if (otherUsersCreatePost === null) {
            return <p className="feed__other__user__create__post">Notifikasi: --</p>
        }
    }

    const getOtherUserCreatePost = () => {
        socket.on("create-new-post", (dataOtherUserCreatePostFromServer) => {
            setOtherUserCreatePost(dataOtherUserCreatePostFromServer)
        })
    }

    useEffect(() => {
        getOtherUserCreatePost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="feed__notif">
            {showNotificationUserCreateNewPost()}
        </div>
    )
}

export default FeedNotif
