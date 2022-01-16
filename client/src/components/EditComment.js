import React, { useState, useEffect } from 'react';
import socket from "../config/socket";
import { toast } from "react-toastify";
import ModalEditComment from "./ModalEditComment";
import { TrashIcon } from '@primer/octicons-react';
import "./EditComment.css";

function EditComment({ setSnapAllDataProfile }) {
    const [yourComments, setYourComments] = useState([]);
    const [ifThereNotComment, setIfThereNotComment] = useState("")
    const [snapYourComments, setSnapYourComments] = useState(false);

    const getYourComments = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "https://intense-river-55466.herokuapp.com/comments";
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allComments => {
                if (allComments) {
                    if (allComments.errors) {
                        setIfThereNotComment(allComments.errors.message)
                    } else if (allComments.comments) {
                        setYourComments(allComments.comments)
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const deleteThisComment = (comment_id) => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }
        let url = `https://intense-river-55466.herokuapp.com/comments/${comment_id}`
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(deletedComment => {
                console.log(deletedComment);
                setSnapYourComments(true);
                setSnapAllDataProfile(true);
                socket.emit("trigger-delete-comment", true);
                setYourComments(yourComments.filter(dataComment => dataComment.id !== comment_id));
                toast.success(`Berhasil menghapus data Comment dengan ID: ${comment_id}`);
            })
            .catch(err => {
                console.error(err);
            })
        return function cleanup() {
            abortController.abort();
        }

    }

    const showCommentTable = () => {
        if (yourComments.length < 1) {
            return (
                <h5 className="edit__comment__text__if__empty">{ifThereNotComment}</h5>
            )
        } else if (yourComments.length > 0) {
            return (
                <table border="1" className="edit__comment__table">
                    <thead>
                        <tr>
                            <th className="edit__comment__table__column__user">User</th>
                            <th className="edit__comment__table__column__caption">Caption</th>
                            <th className="edit__comment__table__column__comment">Your Comments</th>
                            <th className="edit__comment__table__column__action" colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {yourComments.map(comment => {
                            if (comment.Post === null) {
                                return (
                                    <tr key={comment.id}>
                                        <td>-</td>
                                        <td>Sudah dihapus</td>
                                        <td>{comment.comments}</td>
                                        <td>Cannot Edit</td>
                                        <td><button onClick={() => deleteThisComment(comment.id)} className="edit__comment__delete__button" type="button"><TrashIcon size={24} /></button></td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr key={comment.id}>
                                        <td>{comment.Post.User.username}</td>
                                        <td>{comment.Post.caption}</td>
                                        <td>{comment.comments}</td>
                                        <td><ModalEditComment comment={comment} setSnapYourComments={setSnapYourComments} /></td>
                                        <td><button onClick={() => deleteThisComment(comment.id)} className="edit__comment__delete__button" type="button"><TrashIcon size={24} /></button></td>
                                    </tr>
                                )
                            }

                        })}
                    </tbody>
                </table>
            )
        }
    }

    const snapToDeletePosted = () => {
        socket.on("trigger-delete-posted", (dataBooleanFromServer) => {
            setSnapYourComments(dataBooleanFromServer);
        })
    }

    useEffect(() => {
        getYourComments();
        snapToDeletePosted();
        setSnapYourComments(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapYourComments])

    return (
        <div className="edit__comment">
            <p className="edit__comment__text__title"><strong>Manage Your Comment (update & delete)</strong></p>
            {showCommentTable()}
        </div>
    )
}

export default EditComment;
