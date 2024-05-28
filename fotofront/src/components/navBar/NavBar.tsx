import { IconButton, HStack, Text, background } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <HStack
      width="100%"
      align="center"
      justifyContent="center"
      boxShadow="0px 2px 6px rgba(0, 0, 0, 0.1)"
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
      />
      <Text className="titre" flex="1" width="80%" textAlign="center">
        {" "}
        FotoFoireuses{" "}
      </Text>
      <img
        src="/viking.ico"
        alt="Icone"
        style={{ width: "24px", height: "24px", marginRight: "8px" }}
      />
    </HStack>
  );
};

export default NavBar;
