import FotoLogin from "./components/FotoLogin/FotoLogin";
import Gallery from "./components/Gallery/Gallery";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import FotoForm from "./components/FotoForms/FotoForm";
import React from "react";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/images" element={<Gallery />} />
        <Route path="/connexion" element={<FotoLogin />} />
        <Route path="/inscription" element={<FotoForm />} />
      </Routes>
    </Router>
  );
}

export default App;
