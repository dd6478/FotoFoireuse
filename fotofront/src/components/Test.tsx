import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import concoursService from "../services/concours/concours-service";
import publicationService from "../../src/services/publication/publication-service";
import axios from "axios";

const RefreshTokenButton = () => {
  var log = "";
  const test = async () => {
    const response = await axios.post("http://dd64.fr/api/token/refresh/", {
      // mettre l'url complet sinon boucle infini
      refresh: localStorage.getItem("refresh"),
    });
    console.log(response);
  };

  return (
    <div>
      <Button onClick={test}>Test Requete</Button>
    </div>
  );
};

export default RefreshTokenButton;
