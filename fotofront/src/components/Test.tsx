import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import publicationsService from "../services/foto/publication-service";
import concoursService from "../services/concours/concours-service";

const RefreshTokenButton = () => {
  const [imageURL, setImageURL] = useState("");

  const handleRefreshToken = async () => {
    const formData = new FormData();
    formData.append("title", "321321");
    formData.append("description", "je suis la description");

    console.log(concoursService.uploadPublication(formData));
  };

  const bon = (imageurl: string) => {
    console.log(imageurl);
  };

  return (
    <>
      <Button onClick={handleRefreshToken} colorScheme="teal">
        Requete
      </Button>
    </>
  );
};

export default RefreshTokenButton;
