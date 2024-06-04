import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouterWrapper from "./routerWrapper";
import { useRef } from "react";
import { connect } from "react-redux";

function App({ visualizerOn }) {
  const canvasRef = useRef();

  return (
    <BrowserRouter className="App">
      <RouterWrapper canvasRef={canvasRef} />
      <canvas
        ref={canvasRef}
        className={`vizualizer ${visualizerOn && "vizualizer-active"}`}
      />
    </BrowserRouter>
  );
}

const mapStatetoProps = (state) => ({
  visualizerOn: state.playerReducer.visualizerOn,
});

export default connect(mapStatetoProps, {})(App);
