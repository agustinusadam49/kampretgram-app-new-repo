import React, { useState, useEffect } from 'react';
import socket from "../config/socket";
import "./MyProfile.css";
import EditProfile from "./EditProfile";
import EditPosted from "./EditPosted";
import EditComment from "./EditComment";
import ProfileCard from "./ProfileCard";
import Notifications from "./Notifications";
import DataLike from "./DataLike";
import DataFollowers from "./DataFollowers";
import DataFollowing from "./DataFollowing";

function MyProfile({ setAuth }) {
    setAuth(true);

    const [allDataProfile, setAllDataProfile] = useState([]);
    const [allProfile, setAllProfile] = useState([]);
    const [allDataPost, setAllDataPost] = useState([]);
    const [allDataLike, setAllDataLike] = useState([]);
    const [allDataComment, setAllDataComment] = useState([]);
    const [allDataFollowedBy, setAllDataFollowedBy] = useState([]);
    const [allDataFollowingTo, setAllDataFollowingTo] = useState([]);
    const [snapAllDataProfile, setSnapAllDataProfile] = useState(false);
    const [yourNotifications, setYourNotifications] = useState([]);
    const [ifThereNotNotif, setIfThereNotNotif] = useState("");

    const getYourNotification = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "http://localhost:5000/notifications"
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allDataNotifications => {
                if (allDataNotifications) {
                    if (allDataNotifications.errors) {
                        setIfThereNotNotif(allDataNotifications.errors.message)
                    } else if (allDataNotifications.notifications) {
                        setYourNotifications(allDataNotifications.notifications)
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const getAllUserProfileInfo = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "http://localhost:5000/users/all-users-login-info"
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allDataOfLoginUser => {
                setAllDataProfile(allDataOfLoginUser.user[0]);
                setAllProfile(allDataOfLoginUser.user[0].Profile);
                setAllDataPost(allDataOfLoginUser.post.length);
                setAllDataLike(allDataOfLoginUser.like.length);
                setAllDataComment(allDataOfLoginUser.comment.length);
                setAllDataFollowedBy(allDataOfLoginUser.followed_by.length);
                setAllDataFollowingTo(allDataOfLoginUser.following_to.length);

            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const snapToChangeMyProfile = () => {
        socket.on("trigger-change", (dataBooleanFromServer) => {
            setSnapAllDataProfile(dataBooleanFromServer);
        })
    }

    const snapToChangeNotificationTable = () => {
        socket.on("create-new-post-snap", (dataBooleanFromServer) => {
            setSnapAllDataProfile(dataBooleanFromServer)
        })
    }

    useEffect(() => {
        getAllUserProfileInfo();
        getYourNotification();
        snapToChangeNotificationTable();
        snapToChangeMyProfile();
        setSnapAllDataProfile(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapAllDataProfile])

    return (
        <div className="my__profile__page">
            <div className="my__profile__container__1">
                <ProfileCard
                    allDataProfile={allDataProfile}
                    allProfile={allProfile}
                    allDataPost={allDataPost}
                    allDataLike={allDataLike}
                    allDataComment={allDataComment}
                    allDataFollowedBy={allDataFollowedBy}
                    allDataFollowingTo={allDataFollowingTo}
                />
                <EditProfile setSnapAllDataProfile={setSnapAllDataProfile} />
                <DataLike />
                <DataFollowers />
                <DataFollowing />
            </div>

            <div className="my__profile__container__2">
                <EditPosted setSnapAllDataProfile={setSnapAllDataProfile} />
                <EditComment setSnapAllDataProfile={setSnapAllDataProfile} />
                <Notifications
                    yourNotifications={yourNotifications}
                    ifThereNotNotif={ifThereNotNotif}
                />
            </div>
        </div>
    )
}

export default MyProfile;