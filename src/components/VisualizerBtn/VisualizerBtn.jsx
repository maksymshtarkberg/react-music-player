import { connect } from "react-redux";
import "./styles.css";

const VisualizerBtn = ({ handleVisualizerOn, visualizerOn }) => {
  return (
    <button className="btn" type="button" onClick={handleVisualizerOn}>
      {visualizerOn ? (
        <strong>VIZUALIZER OFF</strong>
      ) : (
        <strong>VIZUALIZER ON</strong>
      )}
      <div id="container-stars">
        <div id="stars"></div>
      </div>

      <div id="glow">
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </button>
  );
};

const mapStatetoProps = (state) => ({
  visualizerOn: state.playerReducer.visualizerOn,
});

export default connect(mapStatetoProps, {})(VisualizerBtn);
