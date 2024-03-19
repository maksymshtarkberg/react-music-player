import axios from "axios";

export const uploadAvatar = async (avatar, headers) => {
  try {
    const formData = avatar && new FormData();
    // formData.append("avatar", avatar.file);
    formData.append("avatar", avatar);

    const response = await axios.post(
      `http://localhost:1337/api/v1/user/avatar/upload`,
      formData,
      { headers }
    );
    if (response.status === 200) {
      const userInfo = response.data;
      console.log("В функции" + userInfo);
      return userInfo;
    }
  } catch (error) {
    console.log(error.message);
  }
};
