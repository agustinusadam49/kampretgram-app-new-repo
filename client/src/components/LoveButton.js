import React, { useState, useEffect } from 'react';
import socket from "../config/socket";
import { HeartIcon, HeartFillIcon } from '@primer/octicons-react';
import { toast } from "react-toastify";
import "./LoveButton.css";

function LoveButton({ setSnap, post, setSnapComment, likesPunyaUser }) {
    const [likeState, setLikeState] = useState(undefined);
    const [like_id, setLikeId] = useState(undefined);

    const saveLikeIdDelete = (id_like_from_database) => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            id_delete: id_like_from_database
        }
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }
        let url = `https://intense-river-55466.herokuapp.com/likes/${id_like_from_database}`;
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(resultEditIdDelete => {
                console.log(resultEditIdDelete);
                setSnap(true);
                setSnapComment(true);
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const increaseLikeByOne = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            PostId: post.id,
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
        let url = "https://intense-river-55466.herokuapp.com/likes"
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(newLikes => {
                setLikeState(newLikes.like_data.status);
                setLikeId(newLikes.like_data.id);
                saveLikeIdDelete(newLikes.like_data.id);
                toast.success(`Berhasil menambahkan Like`);
                setSnapComment(true)
                setSnap(true)
            })
            .catch(err => {
                console.error(err)
            })
        return function cleanup() {
            abortController.abort()
        }
    }

    const decreaseLikeByOne = (id) => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }
        let url = `https://intense-river-55466.herokuapp.com/likes/${id}`;
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(deletedLike => {
                if (deletedLike) {
                    toast.success(`Berhasil mengurangi Like`);
                    setSnapComment(true);
                    setSnap(true);
                }
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const onChangeHeartIcon = () => {
        if (likeState === 1) {
            return <HeartFillIcon size={24} />
        } else if (likeState === undefined) {
            return <HeartIcon size={24} />
        }
    }

    const pressLikesButton = (e) => {
        e.preventDefault();
        if (likeState === undefined) {
            increaseLikeByOne();
            socket.emit("trigger-love-change", true)
        } else if (likeState === 1) {
            decreaseLikeByOne(like_id);
            setLikeState(undefined);
            socket.emit("trigger-love-change", true)
        }
    }

    useEffect(() => {
        if (likesPunyaUser.length === 1) {
            likesPunyaUser.map(data => setLikeState(data.status))
            likesPunyaUser.map(data => setLikeId(data.id_delete))
        } else if (likesPunyaUser.length === 0) {
            setLikeState(undefined)
            setLikeId(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likesPunyaUser])

    return (
        <div>
            <button
                className="post__likeButton"
                variant="contained"
                color="primary"
                onClick={(e) => pressLikesButton(e)}
            >{onChangeHeartIcon()}</button>
        </div>
    )
}

export default LoveButton
