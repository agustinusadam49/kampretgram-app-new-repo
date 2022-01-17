import React, { useState, useEffect } from 'react';
import "./UsersOnlineInfo.css";
import OnlineUsersCard from "./OnlineUsersCard";

function UsersOnlineInfo({ allUsersOnline, allFollowsData, setSnap }) {
    const [userOnlineData, setUserOnlineData] = useState([]);
    const [yourId, setYourId] = useState(null)

    const getYourData = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "https://intense-river-55466.herokuapp.com/users/all-users-login-info"
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(allDataOfLoginUser => {
                setYourId(allDataOfLoginUser.user[0].id);
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }
    }

    useEffect(() => {
        getYourData();
        setUserOnlineData(allUsersOnline);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yourId, allUsersOnline])

    return (
        <div className="users__online__info">
            <p className="users__online__info__text"><strong>Users Online</strong></p>
            { userOnlineData.map((userOnline) => (
                <>
                    {
                        userOnline.id !== yourId
                            ? <OnlineUsersCard
                                key={userOnline.id}
                                yourId={yourId}
                                id_user_online={userOnline.id}
                                users_online={userOnline}
                                avatar={userOnline?.Profile?.avatar_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTFnG0huY6whcqQtmgJDP7XgSb8VCpmLUnKXw&usqp=CAU"}
                                username={userOnline.username}
                                allFollowsData={allFollowsData}
                                setSnap={setSnap}
                            />
                            : ""
                    }
                </>
            )) }
        </div>
    )
}

export default UsersOnlineInfo;
