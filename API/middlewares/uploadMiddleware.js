// middleware/uploadMiddleware.js
import fs from "fs";
import dbConnect from "../config/db.js";
import mongodb from "mongodb";

const uploadMiddleware = (collectionName) => (req, res, next) => {
  let filesToProcess = [];
  console.log(req.files);

  if (req.files && req.files.length > 0) {
    filesToProcess.push(req.files["songFile"][0], req.files["albumCover"][0]);
    console.log(filesToProcess);
  } else if (req.file && req.file.path) {
    filesToProcess.push(req.file);
  }

  if (filesToProcess.length > 0) {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection(collectionName);
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    filesToProcess.forEach((file) => {
      const uploadStream = bucket.openUploadStream(file.filename);

      uploadStream.on("finish", async () => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Failed to delete file:", err);
          } else {
            console.log("File deleted successfully:", file.path);
          }
        });
      });

      uploadStream.on("error", (err) => {
        console.error("Failed to upload file:", err);
      });

      fs.createReadStream(file.path).pipe(uploadStream);
    });
  }
  next();
};

export default uploadMiddleware;
