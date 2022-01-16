import React, { useState, useEffect } from 'react';
import ModalEditUserProfile from "./ModalEditUserProfile";
import "./EditProfile.css"

function EditProfile({ setSnapAllDataProfile }) {
    const [snapUserData, setSnapUserData] = useState(false)
    const [yourData, setYourData] = useState([])

    const getUserDataLogin = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "http://localhost:5000/users/edit-profile-user-login"
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(userData => {
                setYourData(userData.users);
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    useEffect(() => {
        getUserDataLogin();
        setSnapUserData(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapUserData])

    return (
        <div className="edit__profile__form">
            <p><strong>Edit Your Profile (update & delete)</strong></p>
            {
                yourData.map(user_data => {
                    return (
                        <ModalEditUserProfile
                            key={user_data.id}
                            userId={user_data.id}
                            fName={user_data.full_name}
                            userN={user_data.username}
                            eml={user_data.email}
                            avatarUrl={user_data.Profile.avatar_url}
                            status_user={user_data.Profile.status}
                            contact_number={user_data.Profile.phone_number}
                            setSnapUserData={setSnapUserData}
                            setSnapAllDataProfile={setSnapAllDataProfile}
                        />
                    )
                })
            }
        </div>
    )
}

export default EditProfile
