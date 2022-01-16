import React, { useState } from 'react';
import socket from "../config/socket";
import { toast } from "react-toastify";
import "./ModalEditUserProfile.css"

function ModalEditUserProfile({ userId, fName, userN, eml, avatarUrl, status_user, contact_number, setSnapUserData, setSnapAllDataProfile }) {
    const [fullName, setFullName] = useState(fName);
    const [userName, setUserName] = useState(userN);
    const [email, setEmail] = useState(eml);
    const [avatar, setAvatar] = useState(avatarUrl);
    const [userStatus, setUserStatus] = useState(status_user);
    const [phoneNumber, setPhoneNumber] = useState(contact_number);

    const setOriginWhenClose = () => {
        setFullName(fName);
        setUserName(userN);
        setEmail(eml);
        setAvatar(avatarUrl);
        setUserStatus(status_user);
        setPhoneNumber(contact_number);
    }

    const setOriginWhenCancel = () => {
        toast.success("Cancel Edit User & Profile")
        setFullName(fName);
        setUserName(userN);
        setEmail(eml);
        setAvatar(avatarUrl);
        setUserStatus(status_user);
        setPhoneNumber(contact_number);
    }

    const runEditProfileOne = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            full_name: fullName,
            username: userName,
            email: email,
            avatar_url: avatar,
            status: userStatus,
            phone_number: phoneNumber
        }

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }

        let url = `https://intense-river-55466.herokuapp.com/users/${userId}`;
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(editedProfileOne => {
                if (editedProfileOne.code === 400) {
                    toast.error(editedProfileOne.errorMessage);
                    setOriginWhenClose();
                } else if (editedProfileOne.code === 201) {
                    localStorage.setItem("user_name", userName);
                    socket.emit("trigger-change-profile", true);
                    setSnapAllDataProfile(true);
                    toast.success("Berhasil Edit Users & Profile");
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
            <button className="modal__edit__user__profile__button" data-toggle="modal" data-target={`#id${userId}`}>Edit Profile</button>

            <div className="modal fade" id={`id${userId}`}>
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h4 className="modal-title">Edit Your Profile</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => setOriginWhenClose()}>&times;</button>
                        </div>

                        <div className="modal-body">

                            <label>Nama Lengkap:</label>
                            <input
                                className="form-control"
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                            />

                            <label className="mt-3">Username:</label>
                            <input
                                className="form-control"
                                type="text"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                            />

                            <label className="mt-3">Email:</label>
                            <input
                                className="form-control"
                                type="text"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />

                            <label className="mt-3">Avatar:</label>
                            <input
                                className="form-control"
                                type="text"
                                value={avatar}
                                onChange={e => setAvatar(e.target.value)}
                            />

                            <label className="mt-3">Status:</label>
                            <input
                                className="form-control"
                                type="text"
                                value={userStatus}
                                onChange={e => setUserStatus(e.target.value)}
                            />

                            <label className="mt-3">Phone Number:</label>
                            <input
                                className="form-control"
                                type="text"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                            />

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-warning" data-dismiss="modal" onClick={(e) => runEditProfileOne(e)}>Save</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setOriginWhenCancel()}>Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalEditUserProfile;
