import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import concoursService from "../services/concours/concours-service";
import publicationService from "../../src/services/publication/publication-service";
import axios from "axios";

const RefreshTokenButton = () => {
  var log = "";
  const test1 = async () => {
    const response = await axios.get("http://dd64.fr/api/votes/1/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });
    console.log(response);
  };
  const test2 = async () => {
    const response = await axios.get(
      "http://dd64.fr/api/publications/4/votes/",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    console.log(response);
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
    </div>
  );
};

export default RefreshTokenButton;
