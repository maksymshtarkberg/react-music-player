import axios from "axios";

export const getUser = async (headers) => {
  try {
    const response = await axios.get(
      `http://localhost:1337/api/v1/user/getuser`,
      { headers }
    );
    if (response.status === 200) {
      const userInfo = response.data;
      return userInfo;
    }
  } catch (error) {
    console.log(error.message);
  }
};
