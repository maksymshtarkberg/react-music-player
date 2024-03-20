// import Player from "./components/Player/player";
import MainPlayer from "./containers/Main-Player/main-player";
import Menu from "./components/Navigation/menu";
import "./App.css";
import Content from "./containers/Content/content";
import { BrowserRouter } from "react-router-dom";
import RouterWrapper from "./routerWrapper";

function App() {
  return (
    <BrowserRouter className="App">
      <RouterWrapper />
    </BrowserRouter>
  );
}

export default App;
