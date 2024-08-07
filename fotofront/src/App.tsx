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
import { Box } from "@chakra-ui/react";
import Generateur from "./components/generateur/Generateur";

function App() {
  return (
    <Router>
      {/*<NavBar /> // j'ai commente parce que le connexion ne marchait pas mais il faut laisser ca
      <Box h="60px" bg="#31506d"></Box> // pour avoir un espace */}
      <Routes>
        <Route path="/" element={<FotoIndex />} />
        <Route path="/images" element={<Gallery />} />
        <Route path="/connexion" element={<FotoLogin />} />
        <Route path="/inscription" element={<FotoForm />} />
        <Route path="/publication" element={<Publication />} />
        <Route path="/test" element={<RefreshTokenButton />} />
        <Route path="/generateur" element={<Generateur />} />
        <Route
          path="/publication/:idPublication"
          element={<PublicationAffichage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
