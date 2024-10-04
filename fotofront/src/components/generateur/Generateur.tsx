import React, { useState, useEffect } from "react";
import "./generateur.css";
import {
  ChakraProvider,
  Box,
  Button,
  Image,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const images = [
  "vatenkar.png",
  "vagdal.png",
  "utespelare.png",
  "tjena.png",
  "stora.png",
  "slattum.avif",
  "ragrund.png",
  "maximera.png",
  "HEMMAFIXARE.png",
  "hamnskar.png",
  "flintan.png",
  "enhet.png",
  "dronjons.png",
  "bulhettedeviendje.png",
  "barso.avif",
  "bagganas.png",
];

const titres = [
  "vatenkar",
  "vagdal",
  "utespelare",
  "tjena",
  "stora",
  "slattum",
  "ragrund",
  "maximera",
  "HEMMAFIXARE",
  "hamnskar",
  "flintan",
  "enhet",
  "dronjons",
  "bulhettedeviendje",
  "barso",
  "bagganas",
];

const Generateur = () => {
  const navigate = useNavigate();

  const [indexUn, setIndexUn] = useState(
    Math.floor(Math.random() * images.length)
  );

  const [indexDeux, setIndexDeux] = useState(
    Math.floor(Math.random() * images.length)
  );

  const [isRunning, setIsRunning] = useState(false);
  const delai = 15;
  let compteur = 0;

  useEffect(() => {
    if (isRunning) {
      compteur = delai;
      const intervalId = setInterval(() => {
        if (compteur > 0) {
          setIndexUn((prevIndex) => (prevIndex + 1) % images.length);
          setIndexDeux((prevIndex) => (prevIndex + 1) % images.length);

          compteur -= 1;
        } else {
          clearInterval(intervalId);
          setIsRunning(false);
        }
      }, 200 + (delai - compteur) * 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <ChakraProvider>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        flexDirection="column"
        textAlign="center"
      >
        <HStack spacing={4} textAlign="center">
          <VStack spacing={4}>
            <Image
              className="image"
              src={images[indexUn]}
              alt={titres[indexUn]}
              boxSize="300px"
              objectFit="cover"
            />
            <Text fontSize="xl" style={{ color: "white" }}>
              {titres[indexUn]}
            </Text>
          </VStack>
          <VStack spacing={4}>
            <Image
              className="image"
              src={images[indexDeux]}
              alt={titres[indexDeux]}
              boxSize="300px"
              objectFit="cover"
            />
            <Text fontSize="xl" style={{ color: "white" }}>
              {titres[indexDeux]}
            </Text>
          </VStack>
        </HStack>
        <Button onClick={handleStop} mt={4} colorScheme="teal">
          {isRunning ? "Attends..." : "Clique!"}
        </Button>
        <Button
          onClick={() =>
            navigate("/inscription", {
              state: { titre: `${titres[indexUn]} ${titres[indexDeux]}` },
            })
          }
          mt={4}
          colorScheme="teal"
        >
          {"Selectionner"}
        </Button>
      </Box>
    </ChakraProvider>
  );
};

export default Generateur;
