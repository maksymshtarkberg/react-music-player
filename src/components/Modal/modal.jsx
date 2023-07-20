import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UploadSong from "../../pages/UploadSong";

import "./styles.css";

export default function BasicModal({ modalShow, setModalShow }) {
  const handleClose = () => setModalShow(false);

  return (
    <>
      {/* <div className="spin-box">
        <div className={`spinner ${open ? "disp-block" : ""}`}>
          <div className="spinner1"></div>
        </div>
      </div> */}
      <Modal
        open={modalShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ overflowY: "auto", height: 600 }} className="modal">
          <CloseRoundedIcon className="modal-cross" onClick={handleClose} />
          <UploadSong showModal={modalShow} setShowModal={setModalShow} />
        </Box>
      </Modal>
    </>
  );
}
