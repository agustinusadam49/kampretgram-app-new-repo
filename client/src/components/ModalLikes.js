import React, { useState, useEffect } from 'react';

// CSS FILES
import "./ModalLikes.css"

function ModalLikes() {
    const [dataLikes, setDataLikes] = useState([]);
    const [ifLikesError, setIfLikesError] = useState("");

    const getAllLikes = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "http://localhost:5000/likes"
        const requestOptions = {
            method: "GET",
            headers: { token: localStorage.user_token }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allLikes => {
                if (allLikes.errors) {
                    setIfLikesError(allLikes.errors.message);
                } else if (allLikes.likes) {
                    setDataLikes(allLikes.likes);
                }

            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const showPostsLikeData = () => {
        if (dataLikes.length === 0) {
            return (
                <h5 className="edit__posted__text__if__post__empty">{ifLikesError}</h5>
            )
        } else if (dataLikes.length > 0) {
            return (
                <table border="1" className="modal__like__table">
                    <thead>
                        <tr>
                            <th className="modal__like__th__user">User</th>
                            <th className="modal__like__th__image">Image</th>
                            <th className="modal__like__th__caption">Caption</th>
                        </tr>
                    </thead>
                    <tbody>
                        { dataLikes.map((like) => (
                            <tr key={like.id}>
                                { like.Post ? <td>{like.Post.User.username}</td> : "" }
                                { like.Post
                                    ? <td><img className="modal__like__image" src={like.Post.image_url} alt="like" /></td>
                                    : "" }
                                { like.Post ? <td>{like.Post.caption}</td> : "" }
                            </tr>
                        )) }
                    </tbody>
                </table>
            )

        }
    }

    useEffect(() => {
        getAllLikes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="container">
            <button type="button" className="modal__likes__button" data-toggle="modal" data-target="#myModalLikes">Post You like</button>

            <div className="modal fade" id="myModalLikes" role="dialog">
                <div className="modal-dialog">

                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Postingan yang anda sukai</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            {showPostsLikeData()}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ModalLikes;
