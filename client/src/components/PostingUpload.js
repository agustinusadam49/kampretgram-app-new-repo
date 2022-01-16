import React, { useState } from 'react';
import socket from "../config/socket";
import './PostingUpload.css';
import { toast } from "react-toastify";

function PostingUpload({ setSnap }) {
    const [captions, setCaption] = useState("");
    const [imageFile, setImageFile] = useState("");

    const cancelUploadImage = (e) => {
        e.preventDefault();
        setCaption("")
        setImageFile("")
    }

    const addPosting = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "https://intense-river-55466.herokuapp.com/posts"

        let body = {
            caption: captions,
            image_url: imageFile
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(newPost => {
                if (newPost.errorMessage) {
                    toast.error(newPost.errorMessage);
                } else {
                    socket.emit("create-new-post", localStorage.getItem("user_name"))
                    socket.emit("create-new-post-snap", true);
                    toast.success(`Berhasil Posting Image dan Caption baru`);
                    setCaption("");
                    setImageFile("");
                    setSnap(true);
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
        <div className="posting__upload">
            <p className="posting__upload__text"><strong>Upload Your Image & Caption Here</strong></p>

            <input
                className="posting__upload__caption__input"
                type="text"
                placeholder="Enter Caption ..."
                value={captions}
                onChange={(e) => setCaption(e.target.value)}
                size="50"
            />

            <input
                className="posting__upload__image__input"
                type="url"
                placeholder="Enter Image Url ..."
                value={imageFile}
                onChange={(e) => setImageFile(e.target.value)}
                size="50"
            />

            <div className="posting__upload__button__container">
                <button
                    className="posting__upload__button"
                    type="submit"
                    onClick={(e) => addPosting(e)}
                >Upload</button>

                <button
                    className="posting__upload__button"
                    type="button"
                    onClick={(e) => cancelUploadImage(e)}
                >Cancel</button>
            </div>
        </div>
    )
}

export default PostingUpload
