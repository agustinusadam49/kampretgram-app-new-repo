import React, { useState, useEffect } from 'react';
import "./Chat.css";
import ChatCard from "./ChatCard";

function Chat({ allChatsData, ifChatError }) {
    const [chatsData, setChatsData] = useState([]);
    const [notChatDataMessage, setNotChatDataMessage] = useState("");

    const showChats = () => {
        if (chatsData.length === 0) {
            return (
                <p className="chat__error__text__empty__chats">{notChatDataMessage}</p>
            )
        } else if (chatsData.length > 0) {
            return (
                <div>
                    {
                        chatsData.map(chat => {
                            return (
                                <ChatCard
                                    key={chat.id}
                                    chat_id={chat.id}
                                    avatar={chat.Profile.avatar_url}
                                    username={chat.Profile.User.username}
                                />
                            )
                        })
                    }
                </div>
            )
        }
    }

    useEffect(() => {
        setChatsData(allChatsData);
        setNotChatDataMessage(ifChatError);
    }, [allChatsData, ifChatError])
    return (
        <div className="chat">
            <p className="chat__text"><strong>Chat</strong></p>
            {showChats()}
        </div>
    )
}

export default Chat;
