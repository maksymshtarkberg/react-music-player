import "./App.css";
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
