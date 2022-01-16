import React from 'react';
import "./DataFollowers.css";
import ModalFollowers from "./ModalFollowers";

function DataFollowers() {
    return (
        <div className="data__followers">
            <p className="data__followers__text__title"><strong>Lihat siapa saja yang follow Anda!</strong></p>
            <ModalFollowers />
        </div>
    )
}

export default DataFollowers;
