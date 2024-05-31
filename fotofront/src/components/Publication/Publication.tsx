import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import FileUploadButton from "./FileUploadButton";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  files: z.string().array().max(10, "Maximum 10 photos"),
  description: z.string(),
});
type FormData = z.infer<typeof schema>;

const Publication: React.FC = () => {
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
      console.log(descriptionValue);
      // plus qu'a se munir du tableau de fichier, le map et les envoyer un par un avec la description (faut decrypter le token ??? )
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
            overflowX="auto" // Only horizontal scroll
            maxWidth="100vw" // Limit the width to viewport width
            whiteSpace="nowrap" // Prevent images from wrapping
            padding="2"
          >
            {selectedFiles.map((file, index) => (
              <Box
                key={index}
                width="100px"
                height="100px"
                overflow="hidden"
                display="inline-block" // Keep images in a row
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
