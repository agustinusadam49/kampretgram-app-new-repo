import React, { useState, useEffect } from 'react';
import "./ProfileCard.css"

function ProfileCard({ allDataProfile, allProfile, allDataPost, allDataLike, allDataComment, allDataFollowedBy, allDataFollowingTo }) {
    const [dataProfile, setDataProfile] = useState([]);
    const [profile, setProfile] = useState([]);
    const [dataPost, setDataPost] = useState([]);
    const [dataLike, setDataLike] = useState([]);
    const [dataComment, setDataComment] = useState([]);
    const [dataFollowedBy, setDataFollowedBy] = useState([]);
    const [dataFollowingTo, setDataFollowingTo] = useState([]);

    useEffect(() => {
        setDataProfile(allDataProfile);
        setProfile(allProfile);
        setDataPost(allDataPost);
        setDataLike(allDataLike);
        setDataComment(allDataComment);
        setDataFollowedBy(allDataFollowedBy);
        setDataFollowingTo(allDataFollowingTo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allDataProfile, allProfile, allDataPost, allDataLike, allDataComment, allDataFollowedBy, allDataFollowingTo])
    return (
        <div className="profile__card">
            <div className="profile__card__avatar__image">
                <img
                    className="profile__card__avatar"
                    src={profile.avatar_url}
                    alt="Avatar"
                />
                <h5>{dataProfile.username}</h5>
            </div>

            <div className="profile__card__body__info">
                <p>Nama Lengkap Anda: {dataProfile.full_name}</p>
                <p>Email Anda: {dataProfile.email}</p>
                <p>Status Anda: {profile.status}</p>
                <p>Phone Number Anda: {profile.phone_number}</p>
                <p>Jumlah Postingan Anda: {dataPost}</p>
                <p>Jumlah Like Anda: {dataLike}</p>
                <p>Jumlah Comment Anda: {dataComment}</p>
                <p>Followers Anda: {dataFollowedBy}</p>
                <p>Anda Mengikuti: {dataFollowingTo}</p>
            </div>
        </div>
    )
}

export default ProfileCard
