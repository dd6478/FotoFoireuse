import React, { useState } from "react";
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
import fotoService from "../../services/foto-service";
import { jwtDecode } from "jwt-decode";
import concoursService from "../../services/concours-service";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: FileList) => {
    setSelectedFiles(Array.from(files));
  };

  const onSubmit = () => {
    const descriptionInput = document.getElementById("description");
    if (descriptionInput instanceof HTMLTextAreaElement) {
      const descriptionValue = descriptionInput.value;

      const token = localStorage.getItem("access");
      if (token) {
        var userID = jwtDecode<JwtPayload>(token);
      }

      selectedFiles.map((item) => {
        fetch(URL.createObjectURL(item))
          .then((response) => response.blob())
          .then((blob) => {
            const formData = new FormData();
            formData.append("image", blob, item.name);
            formData.append("title", item.name);
            if (descriptionValue) {
              formData.append("description", descriptionValue);
            }
            formData.append("concours", "1");
            formData.append("id", userID.user_id);

            concoursService
              .uploadPublication(formData)
              .then((res) => {
                toast({
                  title: `La publication est en ligne.`,
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              })
              .catch((err) =>
                console.log(
                  "la requete n'est pas passée, avertire l'utilisateur"
                )
              );
          });
      });
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <Box textAlign="center">
        <Box marginRight="2" marginLeft="2">
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
          <FormLabel>Rentrer la description</FormLabel>
          <Textarea
            placeholder="Entrez votre description ici"
            maxLength={300}
            id="description"
          />
          <FormHelperText>Maximum 300 caractères</FormHelperText>
          <Button type="submit" onClick={onSubmit}>
            Publier
          </Button>
        </FormControl>
      </Box>
    </Flex>
  );
};

export default Publication;
