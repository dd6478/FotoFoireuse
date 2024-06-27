import { Box, Container, Flex } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import publicationService from "../../services/publication/publication-service";
import fotoService from "../../services/foto/foto-service";
import publications from "../../services/publication/http-publicationService";

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
  }, [publicationsId]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner, etc.
  }

  return (
    <Container maxW="container.md" mt={3} centerContent>
      <Flex flexWrap="wrap" justifyContent="center">
        {files.map((file, index) => (
          <Box
            key={index}
            margin="3px"
            overflow="hidden"
            borderRadius="md"
            height="200px"
            width="200px"
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
  );
};

export default PublicationAffichage;
