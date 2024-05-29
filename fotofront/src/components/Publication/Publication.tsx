import React, { useState } from "react";
import FileUploadButton from "./FileUploadButton";

const Publication = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: FileList) => {
    setSelectedFiles(Array.from(files));
  };

  return (
    <>
      <FileUploadButton onFilesSelected={handleFilesSelected} />
      <div>
        {selectedFiles.length > 0 && (
          <div>
            <h2>Selected Files:</h2>
            <ul>
              {Array.from(selectedFiles).map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Publication;
