const Logout = () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("Exp");
  }
};

export default Logout;
