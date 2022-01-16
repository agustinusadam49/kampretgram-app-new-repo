import React, { useState, useEffect } from 'react';
import socket from "../config/socket";
import { toast } from "react-toastify";
import ModalEditPosted from "./ModalEditPosted";
import "./EditPosted.css";
import { TrashIcon } from '@primer/octicons-react';

function EditPosted({ setSnapAllDataProfile }) {
    const [yourPosts, setYourPosts] = useState([]);
    const [snapTablePosted, setSnapTablePosted] = useState(false);
    const [ifPostError, setIfPostError] = useState("");

    const getYourPosts = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "http://localhost:5000/posts/all-user-login-posts/";
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allYourPosts => {
                if (allYourPosts) {
                    if (allYourPosts.errors) {
                        setIfPostError(allYourPosts.errors.message);
                    } else if (allYourPosts.posts) {
                        setYourPosts(allYourPosts.posts);
                    }
                }
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const deleteThisPosted = (posted_id) => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }
        let url = `http://localhost:5000/posts/${posted_id}`
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(deletedPost => {
                console.log(deletedPost);
                setSnapTablePosted(true);
                setSnapAllDataProfile(true);
                socket.emit("trigger-delete-posted", true);
                setYourPosts(yourPosts.filter(data => data.id !== posted_id))
                toast.success(`Berhasil menghapus data Post dengan ID: ${posted_id}`);
            })
            .catch(err => {
                console.error(err);
            })
        return function cleanup() {
            abortController.abort();
        }
    }

    const showPostedTable = () => {
        if (yourPosts.length === 0) {
            return (
                <h5 className="edit__posted__text__if__post__empty">{ifPostError}</h5>
            )
        } else if (yourPosts.length > 0) {
            return (
                <table border="1" className="edit__posted__table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Caption</th>
                            <th colSpan="2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            yourPosts.map(post => (
                                <tr key={post.id}>
                                    <td>
                                        <img
                                            className="edit__posted__image"
                                            src={post.image_url}
                                            alt=""
                                        />
                                    </td>
                                    <td>{post.caption}</td>
                                    <td><ModalEditPosted post={post} setSnapTablePosted={setSnapTablePosted} /></td>
                                    <td><button onClick={() => deleteThisPosted(post.id)} className="edit__posted__delete__button" type="button"><TrashIcon size={24} /></button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }
    }

    useEffect(() => {
        getYourPosts();
        setSnapTablePosted(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapTablePosted])

    return (
        <div className="edit__posted">
            <p className="edit__posted__text__title"><strong>Manage Your Posted (update & delete)</strong></p>
            {showPostedTable()}
        </div>
    )
}

export default EditPosted
