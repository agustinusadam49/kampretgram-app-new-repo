import React, { useState } from 'react';
import socket from "../config/socket";
import { toast } from "react-toastify";
import { PencilIcon } from '@primer/octicons-react';
import "./ModalEditPosted.css"

function ModalEditPosted({ post, setSnapTablePosted }) {
    const [imageUrl, setImageUrl] = useState(post.image_url)
    const [userCaption, setUserCaption] = useState(post.caption)

    const setOriginWhenClose = () => {
        setImageUrl(post.image_url);
        setUserCaption(post.caption);
    }

    const saveEditedPost = (e) => {
        e.preventDefault()
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            image_url: imageUrl,
            caption: userCaption,
            like: 0,
            dis_like: 0
        }

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }

        let url = `https://intense-river-55466.herokuapp.com/posts/${post.id}`;
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(editedPost => {
                if (editedPost.code === 400) {
                    toast.error(editedPost.errorMessage)
                    setOriginWhenClose()
                } else if (editedPost.code === 201) {
                    setSnapTablePosted(true)
                    socket.emit("trigger-edit-posted", true);
                    toast.success(editedPost.message)
                }
            })
            .catch(err => {
                console.error(err)
            })
        return function cleanup() {
            abortController.abort()
        }
    }

    const showUserLikeTable = () => {
        if (post.Likes.length === 0) {
            return (
                <h5>Belum ada yang menyukai postingan ini</h5>
            )
        } else if (post.Likes.length > 0) {
            return (
                <table border="1" className="edit__posted__table">
                    <thead>
                        <tr>
                            <th>User Avatar</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            post.Likes.map(user_like => {
                                return (
                                    <tr key={user_like.id}>
                                        <td>
                                            <img
                                                className="edit__posted__image"
                                                src={user_like.User.Profile.avatar_url}
                                                alt=""
                                            />
                                        </td>
                                        <td>{user_like.User.username}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            )
        }
    }

    return (
        <div>
            <button className="modal__edit__posted__button__pencil" data-toggle="modal" data-target={`#id${post.id}`}><PencilIcon size={24} /></button>

            <div className="modal" id={`id${post.id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Edit this post data</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => setOriginWhenClose()}>&times;</button>
                        </div>

                        <div className="modal-body">

                            <input
                                className="form-control"
                                placeholder="Title ..."
                                type="text"
                                value={imageUrl}
                                onChange={e =>
                                    setImageUrl(e.target.value)
                                }
                            ></input>

                            <input
                                className="form-control mt-3"
                                placeholder="Description ..."
                                type="text"
                                value={userCaption}
                                onChange={e =>
                                    setUserCaption(e.target.value)
                                }
                            ></input>
                        </div>

                        <div className="modal-footer">
                            <button onClick={(e) => saveEditedPost(e)} type="button" className="btn btn-warning" data-dismiss="modal">Save</button>
                            <button onClick={() => setOriginWhenClose()} type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                        </div>

                        <div>
                            <p><strong>User yang menyukai postingan ini</strong></p>
                            {showUserLikeTable()}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalEditPosted;
