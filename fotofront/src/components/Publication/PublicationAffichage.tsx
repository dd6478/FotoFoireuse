import { Box, Button, Container, Flex, IconButton } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import publicationService from "../../services/publication/publication-service";
import fotoService from "../../services/foto/foto-service";
import publications from "../../services/publication/http-publicationService";
import { HamburgerIcon } from "@chakra-ui/icons";

interface FileItem {
  image: string;
  id: number;
}

interface Params {
  idPublication: string;
}

const PublicationAffichage = () => {
  const { idPublication } = useParams<Params>();
  const publicationsId = Number(idPublication);
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState(window.innerWidth); // hoock pour gérer la taille des phots en fonction de la taille de l'écran

  //const { idPublication } = useParams<Params>();

  useEffect(() => {
    const fetchFilesAndImages = async () => {
      try {
        const res = await publicationService.getPhotos(publicationsId);
        const filesWithImages = await Promise.all(
          res.data.map(async (file: any) => {
            try {
              const image = await fotoService.download(file.ID);
              const contentType = image.headers["content-type"];
              const url = URL.createObjectURL(
                new Blob([image.data], { type: contentType })
              );
              return { ...file, image: url };
            } catch (err) {
              console.error(err);
              return { ...file, image: "" };
            }
          })
        );
        setFiles(filesWithImages);
      } catch (err) {
        console.error("Error loading files and images", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilesAndImages();

    const handleResize = () => {
      setWindowSize(Math.floor(window.innerWidth - 24)); // calcul pour la taille d'une image, sachant qu'il en faut 3 qui prennent le plus de place possible sur les petits ecrans
    };

    window.addEventListener("resize", handleResize);
    handleResize();
  }, [publicationsId]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner, etc.
  }

  return (
    <>
      <Container maxW="container.md" mt={1} centerContent>
        <Flex flexWrap="wrap" justifyContent="center">
          {files.map((file, index) => (
            <Box
              key={index}
              margin="3px"
              overflow="hidden"
              borderRadius="md"
              height={{ base: `${windowSize}px`, md: "400px", lg: "400px" }}
              width={{ base: `${windowSize}px`, md: "400px", lg: "400px" }}
            >
              <img
                src={file.image}
                alt={`Selected file ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Flex>
      </Container>
      <IconButton
        icon={<HamburgerIcon color={"black"} />}
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
      <Button
        colorScheme="blue"
        aria-label="Add"
        size="lg"
        width="200px"
        position="fixed"
        bottom="4"
        left="50%"
        transform="translateX(-50%)"
        zIndex="docked"
        bg="white"
        color="teal"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.8)"
        _hover={{ bg: "gray.200" }}
        _active={{ bg: "gray.300" }}
        onClick={() => {
          navigate("/publication");
        }}
      >
        Vote !
      </Button>
    </>
  );
};

export default PublicationAffichage;
