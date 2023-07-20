import React, { useState } from "react";
import BasicModal from "../Modal/modal";

import "./menu.css";

const Menu = () => {
  const [modalShow, setModalShow] = useState(false);

  const HandleClickOpen = () => {
    setModalShow(true);
    console.log(modalShow);
  };

  return (
    <div className="menu">
      <ul className="menu__player">
        <p>Player</p>
        <li>Listen</li>
        <BasicModal modalShow={modalShow} setModalShow={setModalShow} />
        <li onClick={HandleClickOpen}>Upload song</li>
      </ul>
      <ul className="menu__media">
        <p>Media</p>
        <li>Songs</li>
        <li>Last added</li>
        <li>Artists</li>
      </ul>
      <ul className="menu__playlist">
        <p>Playlists</p>
        <li>asdasd</li>
      </ul>
    </div>
  );
};

export default Menu;
