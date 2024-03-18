import mongodb from "mongodb";
import dbConnect from "../config/db.js";

export const getUser = async (req,res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("users");
    const user = await collection
      .updateOne(
      {_id: new mongodb.ObjectId(req.userId) },
      { $set: { username: req.body.username}
    })
  } catch (error) {
    console.log(error.message);
    return res.send(error.message);
  }
}

export const changeName = async (req, res) => {
  try {
    const db = dbConnect.db("music_streaming");
    const collection = db.collection("users");
    console.log(req.userId)

    const user = await collection.findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.userId) }, 
      { $set: { fullName: req.body.fullName } }, 
    );
     console.log('bodyнннн' + req.body.username)
    if (!user.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user.value });
  } catch (error) {
    console.log(error.message);
    return res.send(error.message);
  }
}

