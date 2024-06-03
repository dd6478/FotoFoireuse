import React, { useEffect, useState } from "react";
import { IconButton, Flex, Box } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import concoursService from "../../services/concours-service";
import fotoService from "../../services/foto-service";

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
              const image = await fotoService.download(file.ID);
              const contentType = image.headers["content-type"];
              const blob = new Blob([image.data], { type: contentType });
              const url = URL.createObjectURL(blob);
              return { ...file, image: url };
            } catch (err) {
              console.error(err);
              return { ...file, image: "" }; // Or handle the error appropriately
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
              src={file.image} // `http://dd64.fr/api/photos/${file.ID}/download/`
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
