import React, { useEffect, useState } from "react";
import { IconButton, Flex, Box, Container } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import concoursService from "../../services/concours/concours-service";
import publicationService from "../../services/publication/publication-service";
import { jwtDecode } from "jwt-decode";
import fotoService from "../../services/foto/foto-service";
import Compteur from "../compteur/Compteur";

interface FileItem {
  title: string;
  description: string;
  ID: number;
  image: string;
  concours: number;
}

const Gallery = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const fetchFilesAndImages = async () => {
      try {
        const res = await concoursService.liste();
        const filesWithImages = await Promise.all(
          res.data.map(async (file) => {
            let idPhoto = 273; // Valeur par défaut

            try {
              // Gestion asynchrone de la première photo
              if (file.first_photo === null) {
                // Attente de la réponse avant de continuer
                const resPhotos = await fotoService.getToutesLesPhotosDuUser(
                  file.user
                );

                // Vérifier que resPhotos contient bien des données
                if (resPhotos.data && resPhotos.data.length > 0) {
                  idPhoto = resPhotos.data[0].ID;
                } else {
                  console.log("Aucune photo n'est dispo");
                  // Si aucune photo n'est disponible pour cet utilisateur, on retourne sans essayer de télécharger l'image
                  return { ...file, image: "" };
                }
              } else {
                idPhoto = file.first_photo;
              }

              // Téléchargement de l'image uniquement une fois idPhoto mis à jour
              const image = await fotoService.download(idPhoto);
              const contentType = image.headers["content-type"];
              const url = URL.createObjectURL(
                new Blob([image.data], { type: contentType })
              );

              return { ...file, image: url };
            } catch (err) {
              console.log(err);
              console.error("Erreur lors du traitement de l'image :", err);
              return { ...file, image: "" }; // Retourner une image vide en cas d'erreur
            }
          })
        );
        setFiles(filesWithImages);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des fichiers et des images :",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFilesAndImages();

    const handleResize = () => {
      setWindowSize(Math.floor((window.innerWidth - 24) / 3)); // calcul pour la taille d'une image, sachant qu'il en faut 3 qui prennent le plus de place possible sur les petits ecrans
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // et on oublie pas d'appeller la fonction parce que à l'initialisation il n'y a pas encore la bonne taille de fenetre
    fetchFilesAndImages();

    // Nettoyage de l'écouteur d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner, etc.
  }

  return (
    <>
      <Container
        maxW="713px"
        paddingLeft={0} // mettre 3 normalement à faire apres la putain d'actualisation
        paddingRight={0}
        mt={3}
        centerContent
      >
        <Compteur targetDate="2024-10-06T00:00:00" />
        <Flex flexWrap="wrap" justifyContent="center">
          {files.map((file, index) => (
            <Box
              key={index}
              margin="3px"
              overflow="hidden"
              borderRadius="md"
              height={{ base: `${windowSize}px`, md: "200px", lg: "200px" }}
              width={{ base: `${windowSize}px`, md: "200px", lg: "200px" }}
              onClick={() => {
                navigate(`/publication/${file.ID}`);
              }}
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
