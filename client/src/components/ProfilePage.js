import React, { useState, useEffect } from 'react';
import socket from "../config/socket";
import { useLocation } from "react-router-dom";
import { Button } from "@material-ui/core";
import "./ProfilePage.css";
import "./ProfileCard.css"
import { toast } from "react-toastify";

function ProfilePage({ setAuth }) {
    setAuth(true);
    let location = useLocation();
    let dataUser = location.state.params.userDataById;
    let dataFollow = location.state.params.followsPunyaUser || location.state.params.yourFollowingData;

    const [postData, setPostData] = useState([]);
    const [likesData, setLikesData] = useState([]);
    const [followerData, setFollowerData] = useState([]);
    const [followingData, setFollowingData] = useState([]);

    const [followState, setFollowState] = useState(undefined);
    const [followdeleteId, setFollowDeleteId] = useState(undefined);

    const [followerNum, setFollowerNum] = useState(0);
    const [followingNum, setFollowingNum] = useState(0);

    const [snapIn, setSnapIn] = useState(false);

    const saveFollowDelete = (id_follow_delete_from_database) => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            id_delete_follow: id_follow_delete_from_database
        }

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }

        let url = `https://intense-river-55466.herokuapp.com/follows/${id_follow_delete_from_database}`;
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(resultEditIdDelete => {
                console.log(resultEditIdDelete);
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const increaseFollowByOne = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            ProfileId: dataUser.profile.id,
            status: 1
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }
        let url = "https://intense-river-55466.herokuapp.com/follows"
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(newFollows => {
                setFollowState(newFollows.follow_data.status);
                setFollowDeleteId(newFollows.follow_data.id);
                saveFollowDelete(newFollows.follow_data.id);
                toast.success(`Berhasil Follow ${dataUser.user.username}`);
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const decreaseFollowByOne = (id) => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }
        let url = `https://intense-river-55466.herokuapp.com/follows/${id}`;
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(deletedFolllow => {
                if (deletedFolllow) {
                    toast.success(`Berhasil Un-Follow ${dataUser.user.username}`);
                }
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const pressFollowButton = (e) => {
        e.preventDefault();
        if (followState === undefined) {
            increaseFollowByOne();
            setSnapIn(true);
            socket.emit("trigger-change", true);
        } else if (followState === 1) {
            decreaseFollowByOne(followdeleteId);
            setFollowState(undefined);
            setSnapIn(true);
            socket.emit("trigger-change", true);
        }
    }

    const onChangeButtonFollow = () => {
        if (followState === 1) {
            return <Button variant="contained" color="secondary" onClick={(e) => pressFollowButton(e)}>Un-Follow</Button>
        } else if (followState === undefined) {
            return <Button variant="contained" color="primary" onClick={(e) => pressFollowButton(e)}>Follow</Button>
        }
    }

    const getUsersById = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = `https://intense-river-55466.herokuapp.com/users/${dataUser.user.id}`;
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(user_data => {
                setFollowingData(user_data.following);
                setFollowerData(user_data.followers);
                setPostData(user_data.posts);
                setLikesData(user_data.likes);
                setFollowingNum(user_data.jumlah_mengikuti);
                setFollowerNum(user_data.profile.Followings.length);
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const showTablePostData = (post_data) => {
        if (post_data.length === 0) {
            return (
                <h5 className="profile__page__text__if__post__empty">Belum Ada data Postingan</h5>
            )
        } else if (post_data.length > 0) {
            return (
                <table border="1" className="profile__page__table">
                    <thead>
                        <tr>
                            <th className="profile__page__th__username">User</th>
                            <th>Image</th>
                            <th>Caption</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            post_data.map(post => (
                                <tr key={post.id}>
                                    <td>{post.User.username}</td>
                                    <td>
                                        <img
                                            className="profile__page__posted__image"
                                            src={post.image_url}
                                            alt=""
                                        />
                                    </td>
                                    <td>{post.caption}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }
    }

    const showTablePostLikeData = (like_post_data) => {
        if (like_post_data.length === 0) {
            return (
                <h5 className="profile__page__text__if__post__empty">Belum ada postingan yang di-like</h5>
            )
        } else if (like_post_data.length > 0) {
            return (
                <table border="1" className="profile__page__table">
                    <thead>
                        <tr>
                            <th className="profile__page__th__username">User</th>
                            <th>Image</th>
                            <th>Caption</th>
                        </tr>
                    </thead>
                    <tbody>
                        { like_post_data.map((like) => (
                            <tr key={like.id}>
                                {like.Post ? <td>{like.Post.User.username}</td> : ""}
                                {like.Post
                                    ? <td><img className="profile__page__posted__image" src={like.Post.image_url} alt="profile-posted" /></td>
                                    : "" }
                                {like.Post ? <td>{like.Post.caption}</td> : ""}
                            </tr>
                        )) }
                    </tbody>
                </table>
            )
        }
    }

    const showTableFollowerData = (follower_data) => {
        if (follower_data.length === 0) {
            return (
                <h5 className="profile__page__text__if__post__empty">Belum ada user yang mengikuti</h5>
            )
        } else if (follower_data.length > 0) {
            return (
                <table border="1" className="profile__page__table">
                    <thead>
                        <tr>
                            <th>User Avatar</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            follower_data.map(follower => (
                                <tr key={follower.id}>
                                    <td>
                                        <img
                                            className="profile__page__posted__image"
                                            src={follower.User.Profile.avatar_url}
                                            alt=""
                                        />
                                    </td>
                                    <td>{follower.User.username}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }
    }

    const showTableFollowingData = (following_data) => {
        if (following_data.length === 0) {
            return (
                <h5 className="profile__page__text__if__post__empty">Belum ada user yang diikuti</h5>
            )
        } else if (following_data.length > 0) {
            return (
                <table border="1" className="profile__page__table">
                    <thead>
                        <tr>
                            <th>User Avatar</th>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            following_data.map(following => (
                                <tr key={following.id}>
                                    <td>
                                        <img
                                            className="profile__page__posted__image"
                                            src={following.Profile.avatar_url}
                                            alt=""
                                        />
                                    </td>
                                    <td>{following.Profile.User.username}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }
    }

    const snapToChangeByOnlineUser = () => {
        socket.on("trigger-change", (dataBooleanFromServer) => {
            setSnapIn(dataBooleanFromServer);
        })
    }

    const snapToCreateNewPostByOnlineUser = () => {
        socket.on("create-new-post-snap", (dataBooleanFromServer) => {
            setSnapIn(dataBooleanFromServer);
        })
    }

    const snapToEditPostedByOnlineUser = () => {
        socket.on("trigger-edit-posted", (dataBooleanFromServer) => {
            setSnapIn(dataBooleanFromServer);
        })
    }

    const snapToDeletePostedByOnlineUser = () => {
        socket.on("trigger-delete-posted", (dataBooleanFromServer) => {
            setSnapIn(dataBooleanFromServer);
        })
    }

    const snapToLikePostByOnlineUser = () => {
        socket.on("trigger-love-change", (dataBooleanFromServer) => {
            setSnapIn(dataBooleanFromServer);
        })
    }

    useEffect(() => {
        if (dataFollow.length === 1) {
            dataFollow.map(data => setFollowState(data.status));
            dataFollow.map(data => setFollowDeleteId(data.id_delete_follow));
        } else if (dataFollow.length === 0) {
            setFollowState(undefined);
            setFollowDeleteId(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataFollow])

    useEffect(() => {
        getUsersById();
        snapToLikePostByOnlineUser();
        snapToDeletePostedByOnlineUser();
        snapToEditPostedByOnlineUser();
        snapToCreateNewPostByOnlineUser();
        snapToChangeByOnlineUser();
        setSnapIn(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapIn])

    return (
        <div className="profile__page">
            <div className="profile__page__title__h3">
                <h3>{dataUser.user.username}'s Profile Page</h3>
            </div>
            <div className="profile__page__card">

                <div className="profile__page__avatar__image">
                    <img
                        className="profile__page__avatar"
                        src={dataUser.profile.avatar_url}
                        alt=""
                    />
                </div>

                <div className="profile__page__body__info">
                    <p>Nama Lengkap: {dataUser.user.full_name}</p>
                    <p>Email: {dataUser.user.email}</p>
                    <p>Status: {dataUser.profile.status}</p>
                    <p>Phone Number: {dataUser.profile.phone_number}</p>
                    <p>Jumlah Postingan: {dataUser.jumlah_postingan}</p>
                    <p>Jumlah Followers: {followerNum}</p>
                    <p>Jumlah Mengikuti: {followingNum}</p>
                    {onChangeButtonFollow()}
                </div>

            </div>

            <div className="profile__page__box__container">
                <div className="profile__page__box">
                    <p className="profile__page__text__title"><strong>{dataUser.user.username}'s Post Data</strong></p>
                    {showTablePostData(postData)}
                </div>

                <div className="profile__page__box">
                    <p className="profile__page__text__title"><strong>{dataUser.user.username}'s Post Likes Data</strong></p>
                    {showTablePostLikeData(likesData)}
                </div>

                <div className="profile__page__box">
                    <p className="profile__page__text__title"><strong>{dataUser.user.username}'s Followers Data</strong></p>
                    {showTableFollowerData(followerData)}
                </div>

                <div className="profile__page__box">
                    <p className="profile__page__text__title"><strong>{dataUser.user.username} is Following to:</strong></p>
                    {showTableFollowingData(followingData)}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
