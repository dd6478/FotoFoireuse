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
    if (files && files.length > 0) {
      onFilesSelected(files);
      toast({
        title: `${files.length} file(s) selected.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
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
        Select Photos
      </Button>
    </Box>
  );
};

export default FileUploadButton;
