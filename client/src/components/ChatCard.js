import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { CommentDiscussionIcon } from '@primer/octicons-react';
import socket from "../config/socket";
import "./ChatCard.css";

function ChatCard({ chat_id, avatar, username }) {
    const [isViewMessage, setIsViewMessage] = useState(true);
    const [inputMessage, setInputMessage] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [snapMessage, setSnapMessage] = useState(false);

    const getMessagesOfThisChat = () => {
        setIsViewMessage(!isViewMessage);
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = `http://localhost:5000/chats/${chat_id}`
        const requestOption = {
            method: "GET",
            headers: { token: localStorage.user_token }
        }
        fetch(url, requestOption, { signal: signal })
            .then(response => response.json())
            .then(dataChatById => {
                setAllMessages(dataChatById.chat_data.Messages)
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }

    }

    const addMessage = (e) => {
        e.preventDefault();

        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            ChatId: chat_id,
            messages: inputMessage
        }
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            },
            body: JSON.stringify(body)
        }
        let url = "http://localhost:5000/messages";

        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(newMessage => {
                if (newMessage.errorMessage) {
                    toast.error(newMessage.errorMessage);
                } else {
                    socket.emit("send-message", true);
                    toast.success(`Berhasil menambahkan message`);
                    setSnapMessage(true);
                    setInputMessage("");
                }
            })
            .catch(err => {
                console.error(err)
            })

        return function cleanup() {
            abortController.abort()
        }

    }

    const changeViewMessages = () => {
        if (isViewMessage === true) {
            return (
                <div className="chat__card__messages__box">
                    <form className="chat__card__add__message" onSubmit={addMessage}>
                        <input
                            className="chat__card__message__input"
                            placeholder="Your message here ..."
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                        ></input>
                        <div className="chat__card__button__submit__container">
                            <button className="chat__card__button__submit" type="submit">Submit</button>
                        </div>
                    </form>

                    {
                        allMessages.map(message => {
                            return (
                                <ul key={message.id}>
                                    <li className="chat__card__message__list__box">

                                        <div className="chat__card__message__avatar__container">
                                            <img
                                                className="chat__card__avatar__message"
                                                src={message.User.Profile.avatar_url}
                                                alt=""
                                            />
                                        </div>

                                        <div className="chat__card__message__info__container">
                                            <p className="chat__card__message__username"><strong>{message.User.username}</strong></p>
                                            <p className="chat__card__message__text">{message.messages}</p>
                                        </div>
                                    </li>
                                </ul>
                            )
                        })
                    }
                </div>
            )
        }
    }

    const snapAllMessage = () => {
        socket.on("send-message", (dataBooleanFromServer) => {
            setSnapMessage(dataBooleanFromServer)
        })
    }

    useEffect(() => {
        getMessagesOfThisChat();
        snapAllMessage();
        setSnapMessage(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapMessage])

    return (
        <div className="chat__card">
            <div className="chat__card__info__box">
                <img
                    className="chat__card__avatar"
                    src={avatar}
                    alt=""
                />
                <p className="chat__card__username"><strong>{username}</strong></p>
                <button type="button" className="chat__card__message__button" onClick={() => getMessagesOfThisChat()}><CommentDiscussionIcon size={24} /></button>
            </div>

            <div className="chat__card__messages__box">
                {changeViewMessages()}
            </div>
        </div>
    )
}

export default ChatCard;
