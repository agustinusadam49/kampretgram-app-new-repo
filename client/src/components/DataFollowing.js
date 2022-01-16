import React from 'react';
import "./DataFollowing.css";
import ModalFollowing from "./ModalFollowing";

function DataFollowing() {
    return (
        <div className="data__following">
            <p className="data__following__text__title"><strong>Lihat siapa saja yang Anda ikuti!</strong></p>
            <ModalFollowing />
        </div>
    )
}

export default DataFollowing;
