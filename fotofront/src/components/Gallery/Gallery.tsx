import React, { useEffect } from "react";
import userService from "../../services/user-service";
import axios from "axios";
import fotoService from "../../services/foto-service";
import { IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fotoService
      .liste()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  });

  return (
    <IconButton
      icon={<AddIcon color={"black"} />}
      aria-label="Add"
      size="lg"
      isRound={true}
      position="fixed"
      bottom="4"
      right="4"
      boxShadow="md"
      zIndex="docked"
      bg="white"
      color="teal"
      _hover={{ bg: "gray.200" }} // Optionnel : couleur de fond lors du survol
      _active={{ bg: "gray.300" }} // Optionnel : couleur de fond lorsqu'il est actif
      onClick={() => {
        navigate("/publication");
      }}
    />
  );
};

export default Gallery;
