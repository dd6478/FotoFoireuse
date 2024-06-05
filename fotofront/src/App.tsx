import FotoLogin from "./components/FotoLogin/FotoLogin";
import Gallery from "./components/Gallery/Gallery";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import FotoForm from "./components/FotoForms/FotoForm";
import React from "react";
import RefreshTokenButton from "./components/Test";
import Test from "./components/Test";
import FotoIndex from "./components/FotoIndex/FotoIndex";
import PublicationAffichage from "./components/Publication/PublicationAffichage";
import Publication from "./components/PublicationUpload/Publication";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<FotoIndex />} />
        <Route path="/images" element={<Gallery />} />
        <Route path="/connexion" element={<FotoLogin />} />
        <Route path="/inscription" element={<FotoForm />} />
        <Route path="/publication" element={<Publication />} />
        <Route path="/test" element={<RefreshTokenButton />} />
        <Route
          path="/publication/:idPublication"
          element={<PublicationAffichage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
