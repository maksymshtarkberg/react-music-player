import "./styles.css";

const BtnLoader = ({ top, left }) => {
  const loaderStyle = {
    top: top || "50%",
    left: left || "50%",
  };

  return (
    <div style={loaderStyle} className="btn-loader">
      <div className="btn-loader_cube btn-loader_cube--color"></div>
      <div className="btn-loader_cube btn-loader_cube--glowing"></div>
    </div>
  );
};

export default BtnLoader;
