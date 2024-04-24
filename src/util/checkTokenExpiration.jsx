export const checkTokenExpiration = () => {
  const token = localStorage.getItem("access_token");
  const exp = localStorage.getItem("Exp");
  if (exp && token) {
    const tokenExpirationDate = new Date(exp);
    const currentTime = new Date();
    if (currentTime.getTime() > tokenExpirationDate.getTime()) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("Exp");
      return true;
    }
  }
};
