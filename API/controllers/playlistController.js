import mongodb from "mongodb";
import dbConnect from "../config/db.js";
import fs from "fs";

// @desc   add new playlist
// @route  POST /api/v1/playlist/create
// @access Private
export const addPlaylist = async (req, res) => {
  try {
    // Establishing connection to the database

    const db = dbConnect.db("music_streaming");
    const collection = db.collection("playlists");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const playlistCoverReadStream = fs.createReadStream(req.file.path);
    const playlistCoverUploadStream = bucket.openUploadStream(
      req.file.filename
    );
    playlistCoverReadStream.pipe(playlistCoverUploadStream);

    playlistCoverUploadStream.on("error", (error) => {
      throw error;
    });

    playlistCoverUploadStream.on("finish", async () => {
      console.log("Playlist cover uploaded successfully");

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Failed to delete file:", err);
        } else {
          console.log("File deleted successfully:", req.file.path);
        }
      });

      // Inserting the playlist to the database
      const playlist = await collection.insertOne({
        playlistName: req.body.playlistName,
        createdBy: req.userId,
        songs: [],
        playlistCover: req.file.filename,
        playlistCoverId: playlistCoverUploadStream.id,
      });

      // If the playlist is added successfully return a success message
      if (playlist) {
        res
          .status(201)
          .json({ message: "Playlist added successfully", status: "success" });
      } else {
        res.status(400);
        throw new Error("Invalid song data");
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, status: "error" });
  }
};

// @desc   Delete a playlist
// @route  DELETE /api/v1/playlist/delete/:id
// @access Private
export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const db = dbConnect.db("music_streaming");
    const collection = db.collection("playlists");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });
    const playlistFind = await collection.findOne({
      _id: new mongodb.ObjectId(id),
    });

    const playlist = await collection.deleteOne({
      _id: new mongodb.ObjectId(id),
    });
    if (playlist) {
      await bucket.delete(new mongodb.ObjectId(playlistFind.playlistCoverId));
      return res
        .status(200)
        .json({ message: "Playlist deleted successfully", status: "success" });
    } else throw new Error("Error deleting playlist");
  } catch (error) {
    console.log(error.message);
    return res.json({ error: error.message, status: "error" });
  }
};

// @desc   Add song to playlist
// @route  POST /api/v1/playlist/add/:id
// @access Private
export const addSongToPlaylist = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("playlists");

    const playlist = await collection.findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $push: { songs: req.body[0] } }
    );
    if (playlist) {
      return res
        .status(200)
        .json({ message: "Song added to playlist", status: "success" });
    } else throw new Error("Error adding song to playlist");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, status: "error" });
  }
};

// @desc   Remove song from playlist
// @route  DELETE /api/v1/playlist/remove/:id
// @access Private
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("playlists");

    const playlist = await collection.findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $pull: { songs: { title: req.query.song } } }
    );
    res.status(200).json({ message: "Song removed from playlist" });
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message, status: "error" });
  }
};

// @desc   Get all playlists
// @route  GET /api/v1/playlist/
// @access Private
export const getPlaylists = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("playlists");
    const playlists = await collection
      .find({ createdBy: req.userId })
      .toArray();
    if (playlists.length === 0) {
      res.status(404);
      throw new Error("No playlists found");
    }
    res.status(200).json({ playlists });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message, status: "error" });
  }
};

// @desc   Get a playlist
// @route  GET /api/v1/playlist/:id
// @access Private
export const getPlaylist = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("playlists");

    const playlist = await collection.findOne({
      playlistCover: new mongodb.ObjectId(req.params.id),
    });
    if (playlist) {
      return res.status(200).json({ playlist });
    } else throw new Error("Error getting playlist");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, status: "error" });
  }
};

export const getPlaylistCover = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("playlists");
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error("No id provided");
    }
    const playlistCover = await collection.findOne({
      playlistCoverId: new mongodb.ObjectId(id),
    });

    if (!playlistCover) {
      res.status(404);
      throw new Error("Cover not found");
    }

    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });
    const downloadStream = bucket.openDownloadStream(
      playlistCover.playlistCoverId
    );

    res.set("Content-Type", "image/jpeg");

    downloadStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, status: "error" });
  }
};
