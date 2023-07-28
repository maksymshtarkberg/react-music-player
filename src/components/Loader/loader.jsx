import "./styles.css";

const Loader = () => {
  return (
    <div className="loader">
      <svg className="loader-svg" width="35" height="35" viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
};

export default Loader;
