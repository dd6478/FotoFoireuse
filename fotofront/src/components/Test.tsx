import React from "react";
import axios from "axios";
import { Button } from "@chakra-ui/react";

const RefreshTokenButton = () => {
  const handleRefreshToken = () => {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
      console.error("No refresh token available");
      return;
    }

    axios
      .post("http://dd64.fr/api/token/refresh/", { refresh: refreshToken })
      .then((res) => {
        const newAccessToken = res.data.access;
        localStorage.setItem("access", newAccessToken);
        console.log("New access token:", newAccessToken);
      })
      .catch((err) => {
        console.error("Error refreshing token:", err);
      });
  };

  return (
    <Button onClick={handleRefreshToken} colorScheme="teal">
      Refresh Token
    </Button>
  );
};

export default RefreshTokenButton;
