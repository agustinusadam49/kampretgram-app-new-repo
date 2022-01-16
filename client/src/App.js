import React, { useState, useEffect } from "react";
import socket from "../src/config/socket";
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Feed from "./components/Feed";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProfilePage from "./components/ProfilePage";
import MyProfile from "./components/MyProfile";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import MyProjectPage from "./components/MyProjectPage";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }

  const isLocalStorage = () => {
    if (localStorage.getItem("user_token")) {
      setAuth(true);
    } else if (!localStorage.getItem("user_token")) {
      setAuth(false);
    }
  }

  const clearLocalStorage = () => {
    let userId = localStorage.getItem("user_id");
    const abortController = new AbortController();
    const signal = abortController.signal;
    let body = {
      is_online: 0,
    }

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.user_token
      },
      body: JSON.stringify(body)
    }

    let url = `http://localhost:5000/users/logout/${userId}`;
    fetch(url, requestOptions, { signal: signal })
      .then(response => response.json())
      .then(logoutUser => {
        socket.emit("trigger-user-logout", true);
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_id");
        localStorage.removeItem("current_time");
        localStorage.removeItem("current_date");
        setAuth(false);
        toast.success("Berhasil Logout")
      })
      .catch(err => {
        console.error(err);
      })
    return function cleanup() {
      abortController.abort();
    }
  }

  const changeButton = () => {
    if (isAuthenticated === false) {
      return (
        <div>
          <button className="app__headerButtonRegister"><a className="app__anchor__register" href="http://localhost:3000/register/">Register</a></button>
          <button className="app__headerButtonLogin"><a className="app__anchor__login" href="http://localhost:3000/login/">Login</a></button>
        </div>
      )
    } else if (isAuthenticated === true) {
      return (
        <div>
          <button onClick={() => clearLocalStorage()} className="app__headerButtonLogout">Logout</button>
        </div>
      )
    }
  }

  useEffect(() => {
    isLocalStorage();
  });

  return (
    <div className="app">
      <Router>

        <div className="app__header">

          <div className="app__header__image_brandname">
            <h5 className="app__headerBrandName"><a className="app__anchor__tag" href="http://localhost:3000">KampretGram</a></h5>
          </div>

          <div className="app__headerButton">
            {changeButton()}
          </div>

        </div>

        <Switch>

          <Route exact path="/"
            render={() => {
              if (isAuthenticated === false) {
                return <LandingPage />
              } else if (isAuthenticated === true) {
                return <Redirect to="/feed" />
              }
            }}
          />

          <Route exact path="/about"
            render={() => {
              if (isAuthenticated === false) {
                return <AboutPage />
              } else if (isAuthenticated === true) {
                return <AboutPage />
              }
            }}
          />

          <Route exact path="/contact"
            render={() => {
              if (isAuthenticated === false) {
                return <ContactPage />
              } else if (isAuthenticated === true) {
                return <ContactPage />
              }
            }}
          />

          <Route exact path="/my-project"
            render={() => {
              if (isAuthenticated === false) {
                return <MyProjectPage />
              } else if (isAuthenticated === true) {
                return <MyProjectPage />
              }
            }}
          />

          <Route exact path="/login"
            render={props => {
              if (isAuthenticated === false) {
                return <LoginForm {...props} setAuth={setAuth} />
              } else if (isAuthenticated === true) {
                return <Redirect to="/feed" />
              }
            }}
          />

          <Route exact path="/register"
            render={props => {
              if (isAuthenticated === false) {
                return <RegisterForm {...props} setAuth={setAuth} />
              } else if (isAuthenticated === true) {
                return <Redirect to="/login" />
              }
            }}
          />

          <Route exact path="/feed"
            render={props => {
              if (isAuthenticated === false) {
                return <Redirect to="/login" />
              } else if (isAuthenticated === true) {
                return <Feed {...props} setAuth={setAuth} />
              }
            }}
          />

          <Route exact path="/user-profile"
            render={props => {

              if (isAuthenticated === false) {
                return <Redirect to="/login" />
              } else if (isAuthenticated === true) {
                return <ProfilePage {...props} setAuth={setAuth} />
              }
            }}
          />

          <Route exact path="/my-profile"
            render={props => {
              if (isAuthenticated === false) {
                return <Redirect to="/login" />
              } else if (isAuthenticated === true) {
                return  <MyProfile {...props} setAuth={setAuth} />
              }
            }}
          />

        </Switch>
      </Router>
    </div>
  )
}

export default App;
