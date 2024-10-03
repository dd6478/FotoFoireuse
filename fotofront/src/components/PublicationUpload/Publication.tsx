import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import FileUploadButton from "./FileUploadButton";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import fotoService from "../../services/foto/foto-service";
import { jwtDecode } from "jwt-decode";
import concoursService from "../../services/concours/concours-service";
import { useNavigate } from "react-router-dom";
import publicationService from "../../services/publication/publication-service";

import axios from "axios";
import foto from "../../services/foto/http-fotoService";

interface JwtPayload {
  user_id: string;
}

const schema = z.object({
  files: z.string().array().max(10, "Maximum 10 photos"),
  description: z.string(),
});
type FormData = z.infer<typeof schema>;

const Publication: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [userId, setUserId] = useState("");
  const [dejaPublie, setdejaPublie] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publicationId, setPublicationId] = useState<number | null>(null);
  const [descritpion, setDescription] = useState<string>(" ");

  // Fonction pour télécharger une image en utilisant fotoService et la convertir en un objet File
  const fetchImageAsFile = async (fileID, fileName) => {
    const image = await fotoService.download(fileID);
    const contentType = image.headers["content-type"];
    const blob = new Blob([image.data], { type: contentType });
    return new File([blob], fileName, { type: blob.type });
  };

  // Fonction pour créer un objet FileList à partir d'un tableau de fichiers
  const createFileList = (files) => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  useEffect(() => {
    // trouver le user ID
    const token = localStorage.getItem("access");
    var userID: JwtPayload = {
      user_id: "",
    };
    if (token) {
      userID = jwtDecode<JwtPayload>(token);
      setUserId(userID.user_id);
    }

    // recuperer les fichiers
    const fetchImages = async () => {
      const filesToDownload = await fotoService.getToutesLesPhotosDuUser(
        userID.user_id
      );

      // A SUUUUUUUUUUUUUUUUUUUUPRIMER
      setdejaPublie(filesToDownload.data.length > 0); // boolean qui sert a savoir si l'utilisateur a deja publie ou non

      // Choper  L'id de la publication
      const response = await publicationService.getListePublication();
      let pubID = null;
      for (let i = 0; i < response.data.length; i++) {
        const item = response.data[i];
        if (item["user"] === userID.user_id) {
          // Assurez-vous d'utiliser '===' pour la comparaison
          pubID = item["ID"];

          break; // Cela arrêtera la boucle 'for'
        }
      }

      setPublicationId(pubID);

      if (pubID != null) {
        publicationService.getPublication(pubID).then((res) => {
          setDescription(res.data.description);
        });
      }

      const files = await Promise.all(
        // transformer les blobs en fichiers
        filesToDownload.data.map((file) =>
          fetchImageAsFile(file.ID, file.image)
        )
      );
      const fileList = createFileList(files.reverse()); // faire une liste de fichier, inverser pour conserver l'ordre
      handleFilesSelected(fileList); // mettre ce tableau dans la variable locale
    };

    fetchImages();
  }, []);

  const handleFilesSelected = (files: FileList) => {
    setSelectedFiles(Array.from(files));
  };

  const handleRemoveFileAtIndex = (indexToRemove) => {
    // pour supprimer avec la petite croix une photo
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const onSubmit = () => {
    if (publicationId != null) {
      // on supprime l'ancienne
      publicationService.deletePublication(publicationId);
    }

    if (selectedFiles.length > 0) {
      const descriptionInput = document.getElementById("description");
      if (descriptionInput instanceof HTMLTextAreaElement) {
        const descriptionValue = descriptionInput.value;

        const formData = new FormData();
        formData.append("title", "321321");
        formData.append("description", descriptionValue);

        concoursService
          .uploadPublication(formData)
          .then((res) => {
            const idPubli = res.data.ID;
            selectedFiles.map((item) => {
              fetch(URL.createObjectURL(item))
                .then((response) => response.blob())
                .then((blob) => {
                  const formData = new FormData();

                  formData.append("image", blob, item.name); // comment il sait que c'est la data  de l'image ?
                  formData.append("title", item.name);
                  if (descriptionValue) {
                    formData.append("description", descriptionValue);
                  }
                  formData.append("concours", "1");
                  formData.append("id", userId); // peut poser probleme a tester

                  publicationService
                    .uploadPublicationImage(formData, idPubli)
                    .then((res) => {
                      // on recupere les photos pour determiner la first photo
                      fotoService.getToutesLesPhotosDuUser(1).then((res) => {
                        console.log(res.data[res.data.length - 1].ID);
                        const idfirstphoto = res.data[res.data.length - 1].ID;
                        publicationService.modifPubliFirstFoto(
                          idPubli,
                          idfirstphoto
                        );
                      });

                      // fin, on revient vers la page images
                      navigate("/images");
                    })
                    .catch((err) => {
                      console.log(
                        "la requete n'est pas passée, avertire l'utilisateur"
                      );
                      toast({
                        title: `La publication ne s'est pas sauvegardée`,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    });
                });
            });
          })
          .catch((err) => {
            console.log("la publication n'est pas passée " + err);
          });

        toast({
          title: `La publication est en ligne.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <Box textAlign="center">
        <Box marginTop="10px" marginRight="2" marginLeft="2">
          <FileUploadButton onFilesSelected={handleFilesSelected} />
        </Box>
        {selectedFiles.length > 0 && (
          <Box
            overflowX="auto"
            maxWidth="100vw"
            whiteSpace="nowrap"
            padding="2"
          >
            {selectedFiles.map((file, index) => (
              <Box
                key={index}
                width="100px"
                height="100px"
                overflow="hidden"
                display="inline-block"
                borderRadius="md"
                marginRight="2"
                marginBottom="2"
                position="relative" // Ajoutez cette ligne pour le positionnement relatif
              >
                <CloseIcon
                  position="absolute"
                  top="8px"
                  right="8px"
                  color="white"
                  bg="rgba(0, 0, 0, 0.5)"
                  borderRadius="full"
                  boxSize="20px"
                  p="1"
                  cursor="pointer"
                  onClick={() => handleRemoveFileAtIndex(index)} // Ajoutez une fonction de gestion pour la suppression si nécessaire
                />
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected file ${index + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        )}
        <FormControl isRequired>
          <FormLabel color="white">Rentrer la description</FormLabel>
          <Textarea
            placeholder="Entrez votre description ici"
            width="300px"
            id="description"
            color="white"
            value={descritpion}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormHelperText color="white">Maximum 300 caractères</FormHelperText>
          <Button type="submit" onClick={onSubmit}>
            Sauvegarder
          </Button>
        </FormControl>
      </Box>
    </Flex>
  );
};

export default Publication;
