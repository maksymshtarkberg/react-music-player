// import Player from "./components/Player/player";
import MainPlayer from "./containers/Main-Player/main-player";
import Menu from "./components/Navigation/menu";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Menu />
      <MainPlayer />
    </div>
  );
}

export default App;
