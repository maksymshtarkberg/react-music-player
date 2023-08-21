import React, { useState } from "react";
import axios from "axios";
import "./upload-songs.css";
// import { redirect } from "react-router-dom";

const UploadSong = ({ onUploadSong, close }) => {
  // we are using this to close the sidebar when we land on this page

  // we are using this to upload the file
  const [file, setFile] = useState();
  const [title, setTitle] = useState();
  const [artist, setArtist] = useState();
  const [album, setAlbum] = useState();
  const [description, setDescription] = useState();
  const [createdAt, setcreatedAt] = useState();

  // we are using this to handle the file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // we are using this to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setcreatedAt(Date.now());
    console.log(createdAt);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("description", description);
    formData.append("createdAt", createdAt);

    const body = {
      title,
      artist,
      album,
      description,
      createdAt: Date.now(),
    };
    // const config = {
    //   headers: {
    //     "content-type": "multipart/form-data",
    //     "x-auth-token": localStorage.getItem("access_token"),
    //   },
    // };

    const __URL__ = "http://localhost:1337";
    const result = await axios.post(`${__URL__}/api/v1/song/upload`, formData, {
      headers: {
        "content-type": "multipart/form-data",
        //   "x-auth-token": localStorage.getItem("access_token"),
      },
      data: body,
    });

    // if the file is uploaded successfully, we will redirect the user to the home page with alert message
    if (result.status === 201) {
      alert("File uploaded successfully");
      onUploadSong();
      close();
    }
  };

  return (
    <div className="upload-songs">
      <h1 className="upload-songs__head">Upload Song</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="upload-songs__table"
      >
        <div className="upload-songs__title fl-dr">
          <label className="" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="upload-songs__insert"
            placeholder="Song Name"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="fl-dr">
          <label className="" htmlFor="title">
            Artist
          </label>
          <input
            type="text"
            name="title"
            className="upload-songs__insert"
            placeholder="Artist Name"
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <div className="fl-dr">
          <label className="px-2" htmlFor="title">
            Album
          </label>
          <input
            type="text"
            name="title"
            className="upload-songs__insert"
            placeholder="Album"
            onChange={(e) => setAlbum(e.target.value)}
            required
          />
        </div>
        <div className="upload-songs__description fl-dr">
          <label className="" htmlFor="title">
            Description
          </label>
          <input
            type="text"
            name="title"
            className="upload-songs__insert"
            placeholder="This song is about..."
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="fl-dr">
          <label htmlFor="audioFile">Audio File</label>
          <input
            className="file-input"
            onChange={handleFileChange}
            type="file"
            name="file"
            accept="audio/*"
            required
          />
        </div>
        <div className="upload-songs__btn">
          <button
            className="button"
            type="submit"
            //   disabled={localStorage.getItem("access_token") ? false : true}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadSong;
