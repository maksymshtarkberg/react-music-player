import React, { useCallback, useState } from "react";
import axios from "axios";
import { decodeToken } from "react-jwt";
import { connect } from "react-redux";
import { addTodo } from "../../redux/actions";
import { getSongs } from "../../util/getSongs";

const UploadSong = ({ addTodo }) => {
  const [songFile, setFile] = useState();
  const [albumCover, setAlbumCover] = useState();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [description, setDescription] = useState("");
  const [createdAt, setCreatedAt] = useState();
  const [songIsUploading, setSongIsUploading] = useState(false);

  const fetchSongs = async () => {
    const updatedSongs = await getSongs();
    addTodo(updatedSongs);
  };

  // we are using this to handle the file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAlbumCoverChange = (e) => {
    setAlbumCover(e.target.files[0]);
  };

  // we are using this to handle the form submission
  const handleSubmit = useCallback(async (e) => {
    setSongIsUploading(true);
    const token = localStorage.getItem("access_token");
    const decoded = decodeToken(token);

    e.preventDefault();
    setCreatedAt(Date.now());
    const formData = new FormData();
    formData.append("songFile", songFile);
    formData.append("albumCover", albumCover);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("description", description);
    formData.append("createdAt", createdAt);
    formData.append("uploadedBy", decoded.id);

    const body = {
      title,
      artist,
      album,
      description,
      createdAt: Date.now(),
    };

    const __URL__ = "http://localhost:1337";
    const result = await axios.post(
      `${__URL__}/api/v1/song/upload`,
      formData,
      {
        headers: {
          "content-type": "multipart/form-data",
          "X-Auth-Token": localStorage.getItem("access_token"),
        },
        data: body,
      },
      [songFile, albumCover, title, artist, album, description, createdAt]
    );

    // if the file is uploaded successfully, we will redirect the user to the home page with alert message
    if (result.status === 201) {
      alert("File uploaded successfully");
      setTitle("");
      setArtist("");
      setAlbum("");
      setDescription("");
      setFile();
      setAlbumCover();
      setCreatedAt("");
      fetchSongs();
      setSongIsUploading(false);
    }
  });

  return (
    <div className="reg-container">
      <h1 className="reg-title">Upload Song</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="reg-form"
      >
        <div className="input-control">
          <label className="reg-label" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            name="title"
            className="reg-input"
            placeholder="Song Name"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-control">
          <label className="reg-label" htmlFor="title">
            Artist
          </label>
          <input
            type="text"
            name="title"
            className="reg-input"
            placeholder="Artist Name"
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <div className="input-control">
          <label className="reg-label" htmlFor="title">
            Album
          </label>
          <input
            type="text"
            name="title"
            className="reg-input"
            placeholder="Album"
            onChange={(e) => setAlbum(e.target.value)}
            required
          />
        </div>
        <div className="input-control">
          <label className="reg-label" htmlFor="title">
            Description
          </label>
          <input
            type="text"
            name="title"
            className="reg-input"
            placeholder="This song is about..."
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="input-control">
          <label htmlFor="audioFile" className="reg-label">
            Audio File
          </label>
          <input
            className="reg-input"
            onChange={handleFileChange}
            type="file"
            name="file"
            accept="audio/*"
            required
          />
        </div>
        <div className="input-control">
          <label htmlFor="albumCover" className="reg-label">
            Album Cover
          </label>
          <input
            className="reg-input"
            onChange={handleAlbumCoverChange}
            type="file"
            name="albumCover"
            accept="image/*"
            required
          />
        </div>
        <div className="upload-songs__btn">
          <button
            className="reg-button"
            type="submit"
            disabled={localStorage.getItem("access_token") ? false : true}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStatetoProps = (state) => ({});

export default connect(mapStatetoProps, { addTodo })(UploadSong);
