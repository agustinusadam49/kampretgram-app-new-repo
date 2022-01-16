import React, { useState, useEffect } from 'react'
import socket from "../config/socket";
import { useHistory } from "react-router-dom";
import "./Post.css";
import { toast } from "react-toastify";
import LoveButton from "./LoveButton";
import numberShortener from "../helpers/numberShortener"

function Post({ post, user_id, username, imageUrl, avatarUrl, caption, setSnap, allLikesData, allFollowsData }) {
    const history = useHistory();
    const [likesNum, setLikesNum] = useState(0);
    const [isViewComment, setIsViewComment] = useState(true);
    const [likesPunyaUser, setLikesPunyaUser] = useState([]);
    const [followsPunyaUser, setFollowPunyaUser] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [inputComment, setInputComment] = useState("");
    const [commentNums, setCommentNums] = useState(0);
    const [snapComment, setSnapComment] = useState(false);
    const [isYourPost, setIsYourPost] = useState(false);

    const getUserProfile = (id) => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = `http://localhost:5000/users/${id}`;
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(userDataById => {
                history.push({ pathname: "/user-profile" }, { params: { userDataById, followsPunyaUser } });
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const changeViewComment = () => {
        if (isViewComment === true) {
            return (
                <div className="post__commentBox">
                    <form className="post__addComment" onSubmit={addComment}>
                        <input
                            className="post__comment__input"
                            placeholder="Comment ..."
                            type="text"
                            value={inputComment}
                            onChange={e => setInputComment(e.target.value)}
                        ></input>
                        <div className="post__button__submit__container">
                            <button className="post__button__comment__submit" type="submit">Submit</button>
                        </div>
                    </form>

                    {
                        allComments.map(comment => (
                            <ul key={comment.id}>
                                <li className="post__comment__list__box">

                                    <div className="post__comment__avatar__container">
                                        <img
                                            className="post__avatar__comment"
                                            src={comment.User.Profile.avatar_url}
                                            alt=""
                                        />
                                    </div>

                                    <div className="post__comment__info__container">
                                        <p className="post__comment__username"><strong>{comment.User.username}</strong></p>
                                        <p className="post__comment__text">{comment.comments}</p>
                                    </div>

                                </li>
                            </ul>
                        ))
                    }
                </div>
            )
        }
    }

    const getCommentOfPost = () => {
        setIsViewComment(!isViewComment);

        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = `http://localhost:5000/posts/${post.id}`
        const requestOption = {
            method: "GET",
            headers: { token: localStorage.user_token }
        }
        fetch(url, requestOption, { signal: signal })
            .then(response => response.json())
            .then(dataPostById => {
                setLikesNum(dataPostById.jumlah_likes);
                setAllComments(dataPostById.comments);
                setCommentNums(dataPostById.comments.length);
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const addComment = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            PostId: post.id,
            comments: inputComment
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }
        let url = "http://localhost:5000/comments";

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(newComment => {
                if (newComment.errorMessage) {
                    toast.error(newComment.errorMessage);
                } else {
                    toast.success(`Berhasil menambahkan comment`);
                    setSnapComment(true);
                    socket.emit("trigger-comment-change", true);
                    setInputComment("");
                }
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const filterDataLikesUser = () => {
        if (allLikesData) {
            setLikesPunyaUser(allLikesData.filter(data => data.PostId === post.id))
        } else if (allLikesData === undefined) {
            setLikesPunyaUser([])
        }
    }

    const filterDataFollowsUser = () => {
        if (allFollowsData) {
            setFollowPunyaUser(allFollowsData.filter(data => data.ProfileId === post.UserId))
        } else if (allFollowsData === undefined) {
            setFollowPunyaUser([])
        }
    }

    const getUserLogin = () => {
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
                if (allDataOfLoginUser.user[0].id === user_id) {
                    setIsYourPost(true);
                } else if (allDataOfLoginUser.user[0].id !== user_id) {
                    setIsYourPost(false);
                }
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const changeButtonViewProfile = () => {
        if (isYourPost === true) {
            return <p></p>
        } else if (isYourPost === false) {
            return (
                <div className="view__profile__button__box">
                    <button type="button" className="post__button__view__profile" onClick={() => getUserProfile(post.User.id)}>View Profile</button>
                </div>
            )
        }
    }

    const snapToChangeLoveCount = () => {
        socket.on("trigger-love-change", (dataBooleanFromServer) => {
            setSnapComment(dataBooleanFromServer)
        })
    }

    const snapToChangeComment = () => {
        socket.on("trigger-comment-change", (dataBooleanFromServer) => {
            setSnapComment(dataBooleanFromServer);
        })
    }

    const snapToChangeCommentByOnlineUser = () => {
        socket.on("trigger-edit-comment", (dataBooleanFromServer) => {
            setSnapComment(dataBooleanFromServer);
        })
    }

    const snapToDeleteCommentByOnlineUser = () => {
        socket.on("trigger-delete-comment", (dataBooleanFromServer) => {
            setSnapComment(dataBooleanFromServer);
        })
    }

    useEffect(() => {
        getCommentOfPost();
        snapToDeleteCommentByOnlineUser();
        snapToChangeCommentByOnlineUser();
        snapToChangeComment();
        snapToChangeLoveCount();
        setSnapComment(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapComment])

    useEffect(() => {
        getUserLogin();
        filterDataLikesUser();
        filterDataFollowsUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isYourPost, allLikesData, allFollowsData])

    return (
        <div className="post">
            <div className="post__header">
                <div className="avatar__username__box">
                    <img
                        className="post__avatar"
                        src={avatarUrl}
                        alt=""
                    />
                    <h5>{username}</h5>
                </div>
                {changeButtonViewProfile()}

            </div>
            <p className="post__textCaption">{caption}</p>
            <img
                className="post__image"
                src={imageUrl}
                alt=""
            />

            <div className="post_footer">
                <div className="post__likeInfo">
                    <LoveButton
                        setSnapComment={setSnapComment}
                        post={post}
                        setSnap={setSnap}
                        likesPunyaUser={likesPunyaUser}
                    />
                    <p className="post__jumlah__like">{numberShortener(likesNum)}</p>
                </div>

                <p className="post__text__jumlah__comment">Jumlah Comments: {numberShortener(commentNums)}</p>
                <button className="post__viewComments" onClick={() => getCommentOfPost()}>Comments</button>
                <div className="post__commentBox">
                    {changeViewComment()}
                </div>
            </div>
        </div >
    )
}

export default Post