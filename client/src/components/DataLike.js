import React from 'react';
import "./DataLike.css"
import ModalLikes from "./ModalLikes"

function DataLike() {
    return (
        <div className="data__like">
            <p className="data__like__text__title"><strong>Postingan yang anda sukai</strong></p>
            <ModalLikes />
        </div>
    )
}

export default DataLike
