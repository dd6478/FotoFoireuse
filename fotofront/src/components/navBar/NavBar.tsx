import { Button, ButtonGroup, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <HStack>
      <Button colorScheme="blue" onClick={() => navigate("/connexion")}>
        {" "}
        Se connecter{" "}
      </Button>
      <Button colorScheme="blue" onClick={() => navigate("/inscription")}>
        {" "}
        S'inscrire{" "}
      </Button>
      <Text className="titre"> FotoFoireuses </Text>
    </HStack>
  );
};

export default NavBar;
