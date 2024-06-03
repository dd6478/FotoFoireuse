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

const Publication: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: FileList) => {
    setSelectedFiles(Array.from(files));
    console.log(Array.from(files));
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
          />
          <FormHelperText>Maximum 300 caractères</FormHelperText>
          <Button> Publier </Button>
        </FormControl>
      </Box>
    </Flex>
  );
};

export default Publication;
