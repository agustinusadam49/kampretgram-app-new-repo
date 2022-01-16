import React, { useState } from 'react';
import socket from "../config/socket";
import { useHistory } from "react-router-dom";
import Container from '@material-ui/core/Container';
import { toast } from "react-toastify";
import "./LoginForm.css"
import { EyeIcon, EyeClosedIcon } from '@primer/octicons-react';

function LoginForm({ setAuth }) {
    const history = useHistory();
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

    const runLoginForm = (e) => {
        e.preventDefault()
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            email: email,
            password: password
        }

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }

        let url = "http://localhost:5000/users/login/"

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(userLogged => {
                if (userLogged.errors) {
                    toast.error(userLogged.errors.message);
                } else if (!userLogged.errors) {
                    localStorage.setItem("user_token", userLogged.user_token);
                    localStorage.setItem("user_name", userLogged.user_name);
                    localStorage.setItem("user_id", userLogged.user_id);
                    socket.emit("trigger-user-online-from-login", userLogged);
                    toast.success(`Berhasil login sebagai: ${userLogged.user_name}`);
                    setAuth(true);
                }
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const toRegister = () => {
        history.push({ pathname: "/register" });
    }

    return (
        <div className="login__form">
            <Container maxWidth="sm">
                <form onSubmit={runLoginForm} className="login__form__formBody">
                    <h1 className="login__form__text__login">Login</h1>
                    <input
                        className="login__form__all__input"
                        placeholder="Email ..."
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

                    <input
                        className="login__form__all__input"
                        placeholder="Password ..."
                        type={changeType}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>

                    <button type="button" className="login__form__eye__icon" onClick={() => seePassword()}>{changeIcon()}</button>

                    <button
                        className="login_form__button__submit"
                        type="submit"
                    >Login
                </button>

                    <p className="login__form__text__to__register">Haven't had an account, yet? <a onClick={() => toRegister()} href="http://localhost:3000/register">Register</a></p>
                </form>
            </Container>
        </div>
    )
}

export default LoginForm
