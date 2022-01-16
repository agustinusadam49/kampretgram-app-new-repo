import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import "./OnlineUsersCard.css"
import { MailIcon, PaperAirplaneIcon } from '@primer/octicons-react';
import { toast } from "react-toastify";
import socket from "../config/socket";

function OnlineUsersCard({ id_user_online, yourId, users_online, avatar, username, allFollowsData }) {
    const history = useHistory();
    const [yourFollowingData, setYourFollowingData] = useState([]);
    const [isViewMessage, setIsViewMessage] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [yourMessages, setYourMessages] = useState([]);
    const [snapMessage, setSnapMessage] = useState(false);
    const [isType, setIsType] = useState(false);
    const [typeName, setTypeName] = useState("");
    const [unreadMessages, setUnreadMessages] = useState([])
    const [userMessageReceiverId, setUserMessageReceiverId] = useState(null)
    const [userMessageSenderId, setUserMessageSenderId] = useState(null)

    const updateReadToTrue = (messagesNotReadYet) => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        for (let i = 0; i < messagesNotReadYet.length; i++) {
            let messageId = messagesNotReadYet[i].id
            let body = {
                ProfileId: messagesNotReadYet[i].ProfileId,
                UserId: messagesNotReadYet[i].UserId,
                chats: messagesNotReadYet[i].chats,
                read: true

            }
            let url = `http://localhost:5000/messages/${messageId}`;
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.user_token
                },
                body: JSON.stringify(body)
            }
            fetch(url, requestOptions, { signal: signal })
                .then(response => response.json())
                .then(resultMessageEdited => {
                    console.log(resultMessageEdited);
                })
                .catch(err => {
                    console.error(err);
                })
        }
        if (unreadMessages.length) {
            setUnreadMessages([])
        }

        return function cleanup() {
            abortController.abort();
        }
    }

    const getYourMessageData = (idAnda) => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = "http://localhost:5000/messages";
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(yourMessageData => {
                let temporaryAllMessages = []
                const incommingMessage = yourMessageData.messages.filter((message) => message.UserId === id_user_online && message.ProfileId === idAnda)
                const unReadMessages = incommingMessage.filter((message) => message.read === false)
                const sentMessage = yourMessageData.messages.filter((message) => message.UserId === idAnda && message.ProfileId === id_user_online)
                
                for (let i = 0; i < incommingMessage.length; i++) { temporaryAllMessages.push(incommingMessage[i]) }
                for (let j = 0; j < sentMessage.length; j++) { temporaryAllMessages.push(sentMessage[j]) }
                
                const sorted_all_messages = temporaryAllMessages.sort((a,b) => {
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                }).reverse();
                
                setYourMessages(sorted_all_messages)

                if (isViewMessage === true) {
                    updateReadToTrue(unReadMessages)
                } else if (isViewMessage === false) {
                    setUnreadMessages(unReadMessages)
                }
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const getUserOnlineProfile = (id) => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        let url = `http://localhost:5000/users/${id}`;
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.user_token
            }
        }
        fetch(url, requestOptions, { signal: signal })
            .then(response => response.json())
            .then(userDataById => {
                history.push({ pathname: "/user-profile" }, { params: { userDataById, yourFollowingData } });
            })
            .catch(err => {
                console.error(err);
            })

        return function cleanup() {
            abortController.abort();
        }
    }

    const seeYourMessagesOnThisUser = () => {
        setIsViewMessage(!isViewMessage);
        updateReadToTrue(unreadMessages);
    }

    const addMessage = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        const signal = abortController.signal;

        let body = {
            ProfileId: id_user_online,
            chats: inputMessage
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
                    socket.emit("create-new-message", newMessage.message_data)
                    toast.success("Pesan Terkirim!");
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

    const viewProfileButton = (online_user_id) => {
        if (online_user_id === yourId) {
            return <p></p>
        } else if (online_user_id !== yourId) {
            return (
                <div className="view__profile__button__box">
                    <button
                        type="button"
                        className="user__online__info__button__view__profile"
                        onClick={() => getUserOnlineProfile(online_user_id)}>
                        View Profile
                    </button>
                </div>
            )
        }
    }

    const viewMessageButton = () => {
        return (
            <div className="online__user__card__message__button__box">
                <button
                    type="button"
                    className="online__user__card__message__button"
                    onClick={() => seeYourMessagesOnThisUser()}>
                    <MailIcon size={24} />
                </button>
            </div>
        )
    }

    const filterYourFollowingData = () => {
        if (allFollowsData) {
            setYourFollowingData(allFollowsData.filter(data => data.ProfileId === id_user_online))
        } else if (allFollowsData === undefined) {
            setYourFollowingData([])
        }
    }

    const viewAllMessages = (idAnda) => {
        if (yourMessages) {
            if (yourMessages.length > 0) {
                return (
                    <ul>
                        { yourMessages.map((message) => (
                            <>
                                <li key={message.id} className="online__users__card__message__list__box">
                                    {
                                        message.UserId === id_user_online && message.ProfileId === idAnda
                                        ? <p className="online__users__card__message__text__inbox">{message.chats}</p>
                                        :  message.UserId === idAnda && message.ProfileId === id_user_online
                                            ? <p className="online__users__card__message__text__sent">{message.chats}</p>
                                            : ""
                                    }
                                </li>
                            </>
                        ))}
                    </ul>
                )
            } else if (yourMessages.length < 1) {
                return <p>Belum Ada Pesan!</p>
            }
        } else if (!yourMessages) {
            return <p>Belum Ada Pesan!</p>
        }

    }

    const changeViewMessages = () => {
        if (isViewMessage === true) {
            return (
                <div className="online__users__card__messages__box">
                    <form className="online__users__card__add__message" onSubmit={addMessage}>
                        {viewUserMessageTyping()}
                        <input
                            className="online__users__card__message__input"
                            placeholder="Your message here ..."
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                        ></input>
                        <div className="online__users__card__button__submit__container">
                            <button className="online__users__card__button__submit" type="submit"><PaperAirplaneIcon size={24} /></button>
                        </div>
                    </form>

                    {viewAllMessages(yourId)}

                </div>
            )
        }
    }

    const viewUserMessageTyping = () => {
        if (isType === true && userMessageReceiverId === yourId && userMessageSenderId === id_user_online) {
            return (
                <p><strong>{typeName}</strong> is typing ...</p> 
            )
        }
    }

    const typingCheckSocket = () => {
        if (inputMessage) {
            socket.emit("user-typing", {userReceiverId: id_user_online, sender: {name: localStorage.getItem("user_name"), id: yourId}});
        } else if (!inputMessage) {
            socket.emit("user-stop-typing");
        }
    }

    const setIsTypeSocket = () => {
        socket.on("user-typing", (dataFromServer) => {
            setIsType(true);
            setTypeName(dataFromServer.sender.name);
            setUserMessageSenderId(dataFromServer.sender.id)
            setUserMessageReceiverId(dataFromServer.userReceiverId)
        })
    }

    const setIsNotTypeSocket = () => {
        socket.on("user-stop-typing", () => {
            setIsType(false);
        })
    }

    const snapSendMessageSocket = () => {
        socket.on("send-message", (dataBooleanFromServer) => {
            setSnapMessage(dataBooleanFromServer);
        })
    }

    useEffect(() => {
        typingCheckSocket();
        setIsNotTypeSocket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputMessage])

    useEffect(() => {
        typingCheckSocket();
        setIsTypeSocket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputMessage])

    useEffect(() => {
        getYourMessageData(yourId);
        filterYourFollowingData();
        snapSendMessageSocket();
        setSnapMessage(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snapMessage, allFollowsData, yourId])

    return (
        <div className="users__online__info__list__box">

            <div className="users__online__info__box">
                <img
                    className="users__online__info__avatar"
                    src={avatar}
                    alt=""
                />
                <p className="users__online__info__username"><strong>{username}</strong></p>
                {viewProfileButton(id_user_online)}
                {viewMessageButton()}

                
                { unreadMessages.length > 0 ? <div className="incoming-unread-messages-badge">{ unreadMessages.length }</div> : "" }
                


            </div>

            <div className="online__user__card__messages__box">
                {changeViewMessages()}
            </div>
        </div>
    )
}

export default OnlineUsersCard;
