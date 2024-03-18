// import Player from "./components/Player/player";
import MainPlayer from "./containers/Main-Player/main-player";
import Menu from "./components/Navigation/menu";
import "./App.css";
import Content from "./containers/Content/content";

function App() {

  return (
    <main>
      <Menu />
      <section className="content">
        <Content/>
        <MainPlayer/>
      </section>
    </main>
  );
}

export default App;
