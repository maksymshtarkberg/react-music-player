import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../config/db.js";

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //if any of the fields are empty
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const db = dbConnect.db("music_streaming");
    const collection = db.collection("users");
    // Check if user exists
    const user = await collection.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      const { token, token_expiration } = generateToken(user._id);
      res.status(200).json({
        message: "User logged in",
        status: "success",
        name: user.fullName,
        email: user.email,
        token: token,
        token_expiration: token_expiration,
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.send(err.message);
  }
};

//@desc: Register a new user
//@route : POST /api/user/login
//@access  Public
export const register = async (req, res) => {
  try {
    //Get the informaiton from the request body
    const { fullName, email, password } = req.body;

    //if any of the fields are empty
    if (!fullName || !email || !password) {
      res.status(400);
      return res.status(400).json({ message: "Please add all fields" });
    }

    const db = dbConnect.db("music_streaming");
    const collection = db.collection("users");

    // Check if user exists
    const userExists = await collection.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const currentDate = new Date();
    const user = await collection.insertOne({
      fullName,
      email,
      password: hashedPassword,
      playllists: [],
      registrationDate: currentDate,
    });

    if (user.insertedId) {
      const userId = user.insertedId.toHexString();
      const { token, token_expiration } = generateToken(userId);
      console.log(user._id);
      res.status(200).json({
        message: "user registered",
        status: "success",
        token: token,
        token_expiration: token_expiration,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (err) {
    console.log(err.message);
    return res.send(err.message);
  }
};

//Generate JWT for the user
const generateToken = (id) => {
  const tokenExpiration = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // Текущее время + 7 дней (в миллисекундах)
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { token, token_expiration: tokenExpiration };
};
