import React, { useEffect, useState } from "react";
import { IconButton, Flex, Box } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/api-client";
import fotoService from "../../services/foto-service";

interface fileItem {
  title: string;
  description: string;
  id: number;
  image: string;
  concours: number;
}

const Gallery = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<fileItem[]>([]);

  useEffect(() => {
    fotoService
      .liste()
      .then((res) => {
        setFiles(res.data);
        res.data.forEach((file) => {
          fotoService
            .download(file.id)
            .then((res) => {
              const blob = new Blob([res.data], { type: "image/png" });
              const url = URL.createObjectURL(blob);
              setFiles((prevImages) =>
                prevImages.map((item) =>
                  item.id === file.id ? { ...item, image: url } : item
                )
              );
            })
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log("erreur sur le chargement des images"));
  }, []);

  return (
    <>
      <Flex flexWrap="wrap">
        {files.map((file, index) => (
          <Box
            key={index}
            width="100px"
            height="100px"
            overflow="hidden"
            borderRadius="md"
            marginRight="2"
            marginBottom="2"
          >
            <img
              src={file.image} // Assurez-vous que 'file.url' correspond à l'URL de votre image // photo/titreimage.png
              alt={`Selected file ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ))}
      </Flex>
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
        _hover={{ bg: "gray.200" }}
        _active={{ bg: "gray.300" }}
        onClick={() => {
          navigate("/publication");
        }}
      />
    </>
  );
};

export default Gallery;
