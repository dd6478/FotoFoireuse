import { IconButton, HStack, Text, background } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isVisible = location.pathname === "/inscription";

  const handleOnClick = () => {
    if ((location.pathname = "/inscription")) navigate("/");
  };

  return (
    <HStack
      width="100%"
      align="center"
      justifyContent="center"
      boxShadow="0px 3px 6px rgba(255, 255, 255, 0.2)"
      marginBottom="10px"
    >
      <IconButton
        aria-label="Search database"
        icon={<ChevronLeftIcon />}
        background="white"
        width="50px"
        height="50px"
        visibility={isVisible ? "visible" : "hidden"}
        onClick={handleOnClick}
      />
      <Text className="titre" flex="1" width="80%" textAlign="center">
        {" "}
        FotoFoireuses{" "}
      </Text>
      <img
        src="/viking.ico"
        alt="Icone"
        style={{ width: "50px", height: "50px", marginRight: "8px" }}
      />
    </HStack>
  );
};

export default NavBar;
