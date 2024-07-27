import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import concoursService from "../services/concours/concours-service";
import publicationService from "../../src/services/publication/publication-service";
import axios from "axios";
import Compteur from "./compteur/Compteur";

const RefreshTokenButton = () => {
  var log = "";
  const test1 = async () => {
    const response = await axios.post(
      "https://dd64.fr/api/concours/",
      {
        name: "viking",
        description: "on est la",
        startDate: "2024-08-10",
        endDate: "2024-09-08",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    console.log(response);
    console.log(response.data);
  };

  const test2 = async () => {
    // pour recuperer la description
    const response = await axios.get(
      "https://dd64.fr/api/concours/1/publications/",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    response.data.forEach((item) => {
      if (item.user === 2) {
        console.log(item.description);
      }
    });
  };
  const test3 = async () => {
    const response = await axios.post(
      "http://dd64.fr/api/publications/1/votes/",
      { user: "1", note: 4 },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    console.log(response);
  };
  const test4 = async () => {
    const response = await axios.delete("http://dd64.fr/api/votes/1", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    console.log(response);
  };

  return (
    <div>
      <Button onClick={test2}>Test Requete</Button>
      <Compteur targetDate="2024-07-24T00:00:00" />
    </div>
  );
};

export default RefreshTokenButton;
