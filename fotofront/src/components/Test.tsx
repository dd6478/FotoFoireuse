import React, { useState, useEffect } from "react";
import { Button, Text } from "@chakra-ui/react";
import concoursService from "../services/concours/concours-service";
import publicationService from "../../src/services/publication/publication-service";
import axios from "axios";
import Compteur from "./compteur/Compteur";
import userService from "../services/user/user-service";
import fotoService from "../services/foto/foto-service";

const RefreshTokenButton = () => {
  interface tabUser {
    idPubli: number;
    idUser: number;
    userName: string;
    first_name: string;
    last_name: string;
    votes: number;
  }
  const [tabVotes, setTabVotes] = useState<tabUser[]>([]);

  var log = "";
  //post concours
  const test1 = async () => {
    const response = await axios.post(
      "https://dd64.fr/api/publications/1/",
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
  //obtenir l'id de publi d'un mec
  const test2 = async () => {
    // pour recuperer la description
    const response = await publicationService.getListePublication();
    let pubID = null;
    for (let i = 0; i < response.data.length; i++) {
      const item = response.data[i];
      if (item["user"] === 1) {
        // Assurez-vous d'utiliser '===' pour la comparaison
        pubID = item["ID"];

        break; // Cela arrêtera la boucle 'for'
      }
    }
    console.log(response.data);
    console.log("ee" + pubID);
  };

  //obtenir un concours
  const test3 = async () => {
    fotoService.getToutesLesPhotosDuUser(1).then((res) => {
      console.log(res.data[res.data.length - 1].ID);
      const idfirstphoto = res.data[res.data.length - 1].ID;
      publicationService.modifPubliFirstFoto(37, idfirstphoto);
    });
  };

  const test4 = async () => {
    // Obtenir la liste des publications
    const response = await publicationService.getListePublication();
    let tabIDpubli = response.data.map((item: any) => ({
      idPubli: item.ID,
      idUser: item.user,
    }));

    // Résoudre les promesses pour récupérer les informations des utilisateurs
    tabIDpubli = await Promise.all(
      tabIDpubli.map(async (item: any) => {
        const res = await userService.getUserName(item.idUser);
        return {
          ...item,
          userName: res.data.username,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
        };
      })
    );

    // Récupérer les votes via une requête API
    const voteResponse = await axios.get("https://dd64.fr/api/votes/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    // Ajouter les votes pour chaque publication
    const updatedTab = tabIDpubli.map((num: any) => ({
      ...num,
      votes: voteResponse.data.filter(
        (item: any) => item.publications === num.idPubli
      ).length,
    }));

    // Mettre à jour l'état
    setTabVotes(updatedTab);
    console.log(updatedTab);
  };

  //modifier la first photo de la publi d'un mec
  const test5 = async () => {
    const response = await publicationService.getPublication(37);
    console.log(response);
  };

  // obtenir les photos
  const test6 = async () => {
    fotoService.getToutesLesPhotosDuUser(1).then((res) => {
      const idfirstphoto = res.data[0].ID;
      console.log(idfirstphoto);
    });
  };

  // obtenir les likes
  const test7 = async () => {
    const response = await axios
      .get("https://dd64.fr/api/votes/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <div>
      <Button onClick={test3}>Test Requete patch</Button>
      <Button onClick={test5}>Test Requete patch</Button>

      <ul>
        {tabVotes.map((item, index) => (
          <li style={{ color: "white" }} key={index}>
            {item.first_name} {item.last_name}: {item.votes}
          </li>
        ))}
      </ul>
      <Compteur targetDate="2024-07-24T00:00:00" />
    </div>
  );
};

export default RefreshTokenButton;
