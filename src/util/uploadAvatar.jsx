import axios from "axios";

export const uploadAvatar = async (avatar, headers) => {
  try {
    const formData = avatar && new FormData();
    formData.append("avatar", avatar);

    const response = await axios.post(
      `${process.env.REACT_APP_URL}/api/v1/user/avatar/upload`,
      formData,
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
