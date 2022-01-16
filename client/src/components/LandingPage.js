import React from 'react';
import { useHistory } from "react-router-dom";
import Container from '@material-ui/core/Container';
import "./LandingPage.css";

function LandingPage() {
    const history = useHistory();

    const toRegister = () => {
        history.push({ pathname: "/register" });
    }

    const toLogin = () => {
        history.push({ pathname: "/login" });
    }

    return (
        <div className="landing__page">
            <Container maxWidth="sm">
                <div className="langing__page__welcome">
                    <h1>Welcome to KampretGram Web App</h1>
                    <p>KampretGram Web App is my portofolio, this is a clone app of Instagram.</p>
                </div>

                <div className="landing__page__button__box">
                    <button
                        className="landing__page__button"
                        onClick={() => toRegister()}
                    >Register</button>

                    <button
                        className="landing__page__button"
                        onClick={() => toLogin()}
                    >Login</button>
                </div>
            </Container>

            <div className="landing__page__footer">
                <div className="landing__page__footer__container__1">

                    <p className="landing__page__footer__menu">
                        <a
                            className="landing__page__anchor__tag"
                            href="https://kampretgram.netlify.app/about"
                        >About</a>
                    </p>

                    <p className="landing__page__footer__menu">
                        <a
                            className="landing__page__anchor__tag"
                            href="https://kampretgram.netlify.app/contact"
                        >Contact</a>
                    </p>

                    <p className="landing__page__footer__menu">
                        <a
                            className="landing__page__anchor__tag"
                            href="https://kampretgram.netlify.app/my-project"
                        >My Project</a>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default LandingPage
