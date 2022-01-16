import React, { useState, useEffect } from 'react';
import socket from '../config/socket';
import "./ModalFollowing.css";

function ModalFollowing() {
    const [dataFollowing, setDataFollowing] = useState([]);
    const [ifFollowingError, setIfFollowingError] = useState("");

    const getAllDataFollowing = () => {
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
                if (allFollows.errors) {
                    setIfFollowingError(allFollows.errors.message);
                } else if (allFollows.follow_data) {
                    setDataFollowing(allFollows.follow_data);
                }
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    const showFollowingData = () => {
        if (dataFollowing.length === 0) {
            return (
                <h5 className="edit__posted__text__if__post__empty">{ifFollowingError}</h5>
            )
        } else if (dataFollowing.length > 0) {
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
                            dataFollowing.map(follow => {
                                return (
                                    <tr key={follow.id}>
                                        <td>
                                            <img
                                                className="edit__posted__image"
                                                src={follow.Profile.avatar_url}
                                                alt=""
                                            />
                                        </td>
                                        <td>{follow.Profile.User.username}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            )
        }
    }

    const snapToChangeFollowByOnlineUser = () => {
        socket.on("trigger-change", (dataBooleanFromServer) => {
            return dataBooleanFromServer;
        })
    }

    useEffect(() => {
        getAllDataFollowing();
        snapToChangeFollowByOnlineUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="container">
            <button type="button" className="modal__following__button" data-toggle="modal" data-target="#myModalFollowing">See Your Following</button>

            <div className="modal fade" id="myModalFollowing" role="dialog">
                <div className="modal-dialog">

                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">User yang anda ikuti</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            {showFollowingData()}
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

export default ModalFollowing;
