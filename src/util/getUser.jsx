import axios from "axios";

export const getUser = async (headers) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/api/v1/user/getuser`,
      {
        headers,
      }
    );
    if (response.status === 200) {
      const userInfo = response.data;
      return userInfo;
    }
  } catch (error) {
    console.log(error.message);
  }
};
