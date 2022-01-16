import React, { useState, useEffect } from 'react';
import socket from "../config/socket";
import Post from "./Post";
import LoginInfo from "./LoginInfo";
import PostingUpload from "./PostingUpload";
import UsersOnlineInfo from "./UsersOnlineInfo";
import FeedNotif from "./FeedNotif";
import "./Feed.css"

function Feed({ setAuth }) {
    setAuth(true)

    const [allPosts, setAllPosts] = useState([]);
    const [ifPostError, setIfPostError] = useState("");
    const [allLikesData, setAllLikesData] = useState([]);
    const [allFollowsData, setAllFollowData] = useState([]);
    const [allUsersOnline, setAllUsersOnline] = useState([]);
    const [snap, setSnap] = useState(false);

    const getAllPosts = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "https://intense-river-55466.herokuapp.com/posts/";
        const requestOptions = {
            method: "GET",
            headers: { token: localStorage.user_token }
        }
        fetch(url, requestOptions, { signal: signal })
            .then(responses => responses.json())
            .then(allPostsData => {
                if (allPostsData.errors) {
                    setIfPostError(allPostsData.errors.message)
                } else if (allPostsData.posts) {
                    setAllPosts(allPostsData.posts);
                }
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const getUserLoginLikes = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "https://intense-river-55466.herokuapp.com/likes"
        const requestOptions = {
            method: "GET",
            headers: { token: localStorage.user_token }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allLikes => {
                setAllLikesData(allLikes.likes)
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const getAllUserLoginFollows = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "https://intense-river-55466.herokuapp.com/follows"
        const requestOptions = {
            method: "GET",
            headers: { token: localStorage.user_token }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allFollows => {
                setAllFollowData(allFollows.follow_data);
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const getAllUserOnline = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "https://intense-river-55466.herokuapp.com/users/online"
        const requestOptions = {
            method: "GET",
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allUsersOnline => {
                setAllUsersOnline(allUsersOnline.users_online);
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const snapUsersOnlineFromRegister = () => {
        socket.on("trigger-user-online-from-register", (dataBooleanFromServer) => {
            setSnap(dataBooleanFromServer);
        })
    }

    const snapUsersOnlineFromLogin = () => {
        socket.on("trigger-user-online-from-login", (dataBooleanFromServer) => {
            setSnap(dataBooleanFromServer);
        })
    }

    const snapUsersLogout = () => {
        socket.on("trigger-user-logout", (dataBooleanFromServer) => {
            setSnap(dataBooleanFromServer)
        })
    }

    const snapUserChangeProfile = () => {
        socket.on("trigger-change-profile", (dataBooleanFromServer) => {
            setSnap(dataBooleanFromServer)
        })
    }

    const snapToChange = () => {
        socket.on("create-new-post-snap", (dataBooleanFromServer) => {
            setSnap(dataBooleanFromServer)
        })
    }

    const snapToChangePosts = () => {
        socket.on("trigger-edit-posted", (dataBooleanFromServer) => {
            setSnap(dataBooleanFromServer);
        })
    }

    const snapToDeletePost = () => {
        socket.on("trigger-delete-posted", (dataBooleanFromServer) => {
            setSnap(dataBooleanFromServer);
        })
    }

    const showAllPostsData = () => {
        if (allPosts.length === 0) {
            return (
                <h5 className="feed__error__text__emtpy__post">{ifPostError}</h5>
            )
        } else if (allPosts.length > 0) {
            return (
                <div>
                    {
                        allPosts.map(post => (
                            <Post
                                key={post.id}
                                id={post.id}
                                user_id={post.User.id}
                                username={post.User.username}
                                caption={post.caption}
                                avatarUrl={post.User.Profile.avatar_url}
                                imageUrl={post.image_url}
                                likes={post.like}
                                dislikes={post.dis_like}
                                setSnap={setSnap}
                                post={post}
                                allLikesData={allLikesData}
                                allFollowsData={allFollowsData}
                            />
                        ))
                    }
                </div>
            )
        }
    }

    useEffect(() => {
        getAllUserOnline();
        getUserLoginLikes();
        getAllUserLoginFollows();
        getAllPosts();
        snapUserChangeProfile();
        snapUsersLogout();
        snapUsersOnlineFromRegister();
        snapUsersOnlineFromLogin();
        snapToDeletePost();
        snapToChangePosts();
        snapToChange();
        setSnap(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snap])

    return (
        <div className="feed">
            <div className="feed__container__2">
                <div className="feed__box__1">
                    < LoginInfo />
                    < FeedNotif />
                </div>

                <div className="feed__box__2">
                    < PostingUpload setSnap={setSnap} />
                    {showAllPostsData()}
                </div>

                <div className="feed__box__3">
                    < UsersOnlineInfo
                        allFollowsData={allFollowsData}
                        allUsersOnline={allUsersOnline}
                        setSnap={setSnap}
                    />
                </div>

            </div>
        </div>
    )
}

export default Feed;

