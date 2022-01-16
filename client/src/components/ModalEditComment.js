import React, { useState } from 'react';
import socket from "../config/socket";
import { toast } from "react-toastify";
import "./ModalEditComment.css";
import { PencilIcon } from '@primer/octicons-react';

function ModalEditComment({ comment, setSnapYourComments }) {
    const [commentData, setCommentData] = useState(comment.comments)

    const setOriginWhenClose = () => {
        setCommentData(comment.comments);
    }

    const saveEditedComment = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        const signal = abortController.signal;
        let body = {
            PostId: comment.Post.id,
            comments: commentData
        }

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }

        let url = `http://localhost:5000/comments/${comment.id}`;
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(editedComment => {
                console.log(editedComment);
                if (editedComment.code === 400) {
                    toast.error(editedComment.errorMessage);
                    setOriginWhenClose();
                } else if (editedComment.code === 201) {
                    setSnapYourComments(true);
                    socket.emit("trigger-edit-comment", true)
                    toast.success(editedComment.message);
                }
            })
            .catch(err => {
                console.error(err)
            })
        return function cleanup() {
            abortController.abort()
        }

    }

    return (
        <div>
            <button className="modal__edit__comment__edit__button" data-toggle="modal" data-target={`#id${comment.id}`}><PencilIcon size={24} /></button>

            <div className="modal" id={`id${comment.id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Edit this comment</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => setOriginWhenClose()}>&times;</button>
                        </div>

                        <div className="modal-body">

                            <input
                                className="form-control"
                                placeholder="Title ..."
                                type="text"
                                value={commentData}
                                onChange={e =>
                                    setCommentData(e.target.value)
                                }
                            ></input>
                        </div>

                        <div className="modal-footer">
                            <button onClick={(e) => saveEditedComment(e)} type="button" className="btn btn-warning" data-dismiss="modal">Save</button>
                            <button onClick={() => setOriginWhenClose()} type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalEditComment
