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
import FileUploadButton from "./FileUploadButton";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import fotoService from "../../services/foto/foto-service";
import { jwtDecode } from "jwt-decode";
import concoursService from "../../services/concours/concours-service";
import { useNavigate } from "react-router-dom";
import publicationService from "../../services/publication/publication-service";

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

  useEffect(() => {
    const token = localStorage.getItem("access");
    var userID: JwtPayload = {
      user_id: "",
    };
    if (token) {
      userID = jwtDecode<JwtPayload>(token);
      setUserId(userID.user_id);
    }
    publicationService.getPublication(userId).then(() => setdejaPublie(true));
    // si la personne a déjà publié on charge ses photos et sa description (et son titre?) et y'aura qu a repatch si il y a des modifs.
  }, []);

  const handleFilesSelected = (files: FileList) => {
    setSelectedFiles(Array.from(files)); // pour l'instant on laisse comme ca mais c'est ici qu'on pourra faire un ajout des photos au fur et a mesure (ce qui implique de mettre une croix pour supprimer la photo de la liste)
  };

  const onSubmit = () => {
    const token = localStorage.getItem("access");

    // verifier si l'utilisateur n'a pas déjà une publication
    var userID: JwtPayload = {
      user_id: "",
    };
    if (token) {
      userID = jwtDecode<JwtPayload>(token);
    }
    var dejaPublie = false;
    publicationService
      .getPublication(userID.user_id)
      .then(() => (dejaPublie = true)); // si la personne a déjà publié on charge ses photos et sa description (et son titre?) et y'aura qu a repatch si il y a des modifs.

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
                formData.append("id", userID.user_id);

                publicationService
                  .uploadPublicationImage(formData, idPubli)
                  .then((res) => {
                    navigate("/images");
                  })
                  .catch((err) =>
                    console.log(
                      "la requete n'est pas passée, avertire l'utilisateur"
                    )
                  );
              });
          });
        })
        .catch((err) => {
          console.log("la publication n'est pas passé " + err);
        });
      toast({
        title: `La publication est en ligne.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
              >
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
          />
          <FormHelperText color="white">Maximum 300 caractères</FormHelperText>
          <Button type="submit" onClick={onSubmit}>
            Publier
          </Button>
        </FormControl>
      </Box>
    </Flex>
  );
};

export default Publication;
