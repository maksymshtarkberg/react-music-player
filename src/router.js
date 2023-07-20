import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/player" />
        <Route path="/song_upload" />
      </Routes>
    </BrowserRouter>
  );
};
