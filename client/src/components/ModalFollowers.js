import React, { useState, useEffect } from 'react';
import "./ModalFollowers.css";

function ModalFollowers() {
    const [dataFollowers, setDataFollowers] = useState([]);
    const [ifFollowersError, setIfFollowersError] = useState("");

    const getAllFollowers = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "https://intense-river-55466.herokuapp.com/follows/followers"
        const requestOptions = {
            method: "GET",
            headers: { token: localStorage.user_token }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allFollows => {
                if (allFollows.errors) {
                    setIfFollowersError(allFollows.errors.message);
                } else if (allFollows.followers) {
                    setDataFollowers(allFollows.followers);
                }
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const showFollowersData = () => {
        if (dataFollowers.length === 0) {
            return (
                <h5 className="edit__posted__text__if__post__empty">{ifFollowersError}</h5>
            )
        } else if (dataFollowers.length > 0) {
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
                            dataFollowers.map(follower => {
                                return (
                                    <tr key={follower.id}>
                                        <td>
                                            <img
                                                className="edit__posted__image"
                                                src={follower.User.Profile.avatar_url}
                                                alt=""
                                            />
                                        </td>
                                        <td>{follower.User.username}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            )
        }
    }

    useEffect(() => {
        getAllFollowers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="container">
            <button type="button" className="modal__follower__button" data-toggle="modal" data-target="#myModalFollower">See Your Followers</button>

            <div className="modal fade" id="myModalFollower" role="dialog">
                <div className="modal-dialog">

                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">User yang mengikuti anda</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            {showFollowersData()}
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

export default ModalFollowers;
