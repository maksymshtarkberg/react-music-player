import axios from "axios";
import { decodeToken } from "react-jwt";

export const getAvatar = async () => {
  const token = localStorage.getItem("access_token");

  const decoded = decodeToken(token);
  if (token) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v1/avatar/${decoded.id}`
      );
      if (response.status === 404) {
        const userAvatar = null;
        return userAvatar;
      }
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};
