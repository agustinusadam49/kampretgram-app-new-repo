import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './LoginInfo.css';

function LoginInfo() {
    const history = useHistory();
    const [userName, setUserName] = useState("");

    const toMyProfilePage = () => {
        history.push({ pathname: "/my-profile" });
    }

    const getUserName = () => {
        let username = localStorage.getItem("user_name");
        setUserName(username);
    }

    useEffect(() => {
        getUserName();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName])

    return (
        <div className="login__info">
            <p className="login__info_text">Hai, <strong>{userName}</strong> welcome to InstaClone</p>
            <button className="login__info__button__to__my__profile" onClick={() => toMyProfilePage()}>Manage your profile</button>
        </div>
    )
}

export default LoginInfo
