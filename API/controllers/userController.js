import mongodb from "mongodb";
import dbConnect from "../config/db.js";
import fs from "fs";

export const getUser = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("users");
    const user = await collection.findOne({
      _id: new mongodb.ObjectId(req.userId),
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      name: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeName = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("users");

    const user = await collection.findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.userId) },
      { $set: { fullName: req.body.fullName } },
      { returnDocument: "after" }
    );
    if (!user.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.value.fullName);
  } catch (error) {
    console.log(error.message);
    return res.send(error.message);
  }
};
export const changeEmail = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("users");

    const user = await collection.findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.userId) },
      { $set: { email: req.body.email } },
      { returnDocument: "after" }
    );
    if (!user.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.value.email);
  } catch (error) {
    console.log(error.message);
    return res.send(error.message);
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("avatars");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const existingAvatar = await collection.findOne({ uploadedBy: req.userId });

    if (existingAvatar) {
      await bucket.delete(new mongodb.ObjectId(existingAvatar.avatar));

      const uploadStream = bucket.openUploadStream(req.file.filename);
      fs.createReadStream(req.file.path).pipe(uploadStream);

      uploadStream.on("error", (error) => {
        throw error;
      });

      uploadStream.on("finish", async () => {
        await collection.updateOne(
          { uploadedBy: req.userId },
          { $set: { avatar: uploadStream.id } }
        );

        res.status(200).json({
          message: "User avatar updated successfully",
          status: "success",
        });
      });
    } else {
      const uploadStream = bucket.openUploadStream(req.file.filename);
      fs.createReadStream(req.file.path).pipe(uploadStream);

      uploadStream.on("error", (error) => {
        throw error;
      });

      uploadStream.on("finish", async () => {
        await collection.insertOne({
          uploadedBy: req.userId,
          avatar: uploadStream.id,
        });

        res.status(200).json({
          message: "User avatar added successfully",
          status: "success",
        });
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message, status: "error" });
  }
};

export const getAvatar = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("avatars");
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("No id provided");
    }
    const avatar = await collection.findOne({ uploadedBy: id });
    // console.log(avatar)

    if (!avatar) {
      return res
        .status(404)
        .json({ message: "No avatar found for the user", status: "no_avatar" });
    }
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });
    const downloadStream = bucket.openDownloadStream(avatar.avatar);

    res.set("Content-Type", "image/jpeg");

    downloadStream.pipe(res);

    downloadStream.on("finish", () => {
      res
        .status(200)
        .json({ message: "Avatar has been found", status: "avatar" });
    });
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message, status: "error" });
  }
};
