import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import fotoService from "../services/foto-service";

const RefreshTokenButton = () => {
  const [imageURL, setImageURL] = useState("");

  const handleRefreshToken = async () => {
    try {
      const res = await fotoService.download(6);
      const uint = new Uint8Array(res.data);
      const string = String.fromCharCode(...uint);
      const base64String = btoa(string);
      setImageURL(`data:image/jpg;base64,${base64String}`);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const bon = (imageurl: string) => {
    console.log(imageurl);
  };

  return (
    <>
      <Button onClick={handleRefreshToken} colorScheme="teal">
        Refresh Token
      </Button>
      {imageURL && <img src={imageURL} alt="download" />}
      <Button onClick={() => bon(imageURL)} colorScheme="teal">
        url ou ?
      </Button>
    </>
  );
};

export default RefreshTokenButton;
