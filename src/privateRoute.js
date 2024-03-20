import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ redirectPath = "/" }) => {
  const access = localStorage.getItem("access_token");

  if (!access) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;
