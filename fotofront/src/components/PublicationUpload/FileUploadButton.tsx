import React from "react";
import { Button, Box, useToast } from "@chakra-ui/react";

type FileUploadButtonProps = {
  onFilesSelected: (files: FileList) => void;
};

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFilesSelected,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("fileInputRef.current is null");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && files.length < 11) {
      // pour gerer les maximums de photos selectionnées
      onFilesSelected(files);
      toast({
        title: `${files.length} file(s) selected.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      if (files && files.length > 11) {
        toast({
          title: `${files.length} fichiers séléctionnés, maximum 10.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: `Il a un problème avec la séléction de fichiers`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box>
      <input
        type="file"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button colorScheme="teal" onClick={handleButtonClick}>
        Sélectionner vos photos
      </Button>
    </Box>
  );
};

export default FileUploadButton;
