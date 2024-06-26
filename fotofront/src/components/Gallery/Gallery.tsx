import React, { useEffect, useState } from "react";
import { IconButton, Flex, Box, Container } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import concoursService from "../../services/concours/concours-service";
import publicationService from "../../services/foto/publication-service";
import { jwtDecode } from "jwt-decode";

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

  useEffect(() => {
    const fetchFilesAndImages = async () => {
      try {
        const res = await concoursService.liste();
        const filesWithImages = await Promise.all(
          res.data.map(async (file) => {
            try {
              const image = await publicationService.download(file.ID);
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
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner, etc.
  }

  return (
    <>
      <Container maxW="container.lg" mt={4} centerContent>
        <Flex flexWrap="wrap" justifyContent="center">
          {files.map((file, index) => (
            <Box
              key={index}
              margin="5px"
              overflow="hidden"
              borderRadius="md"
              height="200px"
              width="200px"
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
