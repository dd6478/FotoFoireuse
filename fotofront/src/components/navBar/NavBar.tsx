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
      <Text> est ce que tu m'entends he ho </Text>
    </HStack>
  );
};

export default NavBar;
