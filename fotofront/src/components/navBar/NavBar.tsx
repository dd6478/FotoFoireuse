import { IconButton, HStack, Text, background } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <HStack
      width="100%"
      align="center"
      justifyContent="center"
      boxShadow="0px 3px 6px rgba(255, 255, 255, 0.2)"
      marginBottom="10px"
    >
      {/* <Button colorScheme="blue" onClick={() => navigate("/connexion")}>
        {" "}
        Se connecter{" "}
      </Button>
      <Button colorScheme="blue" onClick={() => navigate("/inscription")}>
        {" "}
        S'inscrire{" "}
      </Button> */}
      <IconButton
        aria-label="Search database"
        icon={<ChevronLeftIcon />}
        background="white"
        width="50px"
        height="50px"
        visibility={isVisible ? "visible" : "hidden"}
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
