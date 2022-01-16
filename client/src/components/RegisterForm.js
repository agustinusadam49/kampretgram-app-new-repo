import React, { useState } from 'react';
import socket from "../config/socket";
import { useHistory } from "react-router-dom";
import Container from '@material-ui/core/Container';
import { toast } from "react-toastify";
import "./RegisterForm.css"
import { EyeIcon, EyeClosedIcon } from '@primer/octicons-react';

function RegisterForm({ setAuth }) {
    const history = useHistory()

    const [full_name, setFullName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [changeType, setChangeType] = useState("password");
    const [isPassword, setIsPassword] = useState(false);

    const seePassword = () => {
        setIsPassword(!isPassword);
        if (isPassword === true) {
            setChangeType("password")
        } else if (isPassword === false) {
            setChangeType("text")
        }
    }

    const changeIcon = () => {
        if (isPassword === true) {
            return <EyeIcon size={24} />
        } else if (isPassword === false) {
            return <EyeClosedIcon size={24} />
        }
    }

    const runRegistration = (e) => {
        e.preventDefault()

        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            full_name: full_name,
            username: username,
            email: email,
            password: password
        }

        let url = "https://intense-river-55466.herokuapp.com/users/register"
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(newUserData => {
                if (newUserData.code === 400) {
                    toast.error(newUserData.errorMessage);
                } else if (newUserData.errors) {
                    toast.error(newUserData.errors.message);
                } else if (!newUserData.errors) {
                    localStorage.setItem("user_token", newUserData.user_token);
                    localStorage.setItem("user_name", newUserData.user_name);
                    localStorage.setItem("user_id", newUserData.user_id);
                    socket.emit("trigger-user-online-from-register", true);
                    setAuth(true);
                    toast.success(`Registrasi berhasil, Login sebagai: ${newUserData.user_name}`);
                }
            })
            .catch(err => {
                console.log("Data error dari .catch di file RegisterForm.js");
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const toLogin = () => {
        history.push({ pathname: "/login" })
    }

    return (
        <div className="register__form">
            <Container maxWidth="sm">
                <form onSubmit={runRegistration} className="register__form__formBody">
                    <h1 className="register__form__text__register">Register</h1>
                    <input
                        className="register__form__all__input"
                        placeholder="Fullname ..."
                        type="text"
                        value={full_name}
                        onChange={(e) => setFullName(e.target.value)}
                    ></input>

                    <input
                        className="register__form__all__input"
                        placeholder="Username ..."
                        type="text"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                    ></input>

                    <input
                        className="register__form__all__input"
                        placeholder="Email ..."
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

                    <input
                        className="register__form__all__input"
                        placeholder="Password ..."
                        type={changeType}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>

                    <button type="button" className="register__form__eye__icon" onClick={() => seePassword()}>{changeIcon()}</button>

                    <button
                        className="register__form__button__submit"
                        type="submit"
                    >Submit
                    </button>

                    <p className="register__form__text__to__login">Have account already? <button onClick={() => toLogin()}>Login</button></p>
                </form>
            </Container>
        </div>
    )
}

export default RegisterForm
