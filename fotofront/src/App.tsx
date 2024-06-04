import FotoLogin from "./components/FotoLogin/FotoLogin";
import Gallery from "./components/Gallery/Gallery";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import FotoForm from "./components/FotoForms/FotoForm";
import React from "react";
import Publication from "./components/Publication/Publication";
import RefreshTokenButton from "./components/Test";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/images" element={<Gallery />} />
        <Route path="/" element={<FotoLogin />} />
        <Route path="/inscription" element={<FotoForm />} />
        <Route path="/publication" element={<Publication />} />
        <Route path="/test" element={<RefreshTokenButton />} />
      </Routes>
    </Router>
  );
}

export default App;
