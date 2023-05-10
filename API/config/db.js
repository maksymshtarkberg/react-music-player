import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Create a new MongoClient
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("MongoDB database connection established successfully");
});

export default client;
