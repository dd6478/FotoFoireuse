import React, { useEffect } from "react";
import userService from "../../services/user-service";
import axios from "axios";
import fotoService from "../../services/foto-service";

const Gallery = () => {
  useEffect(() => {
    fotoService
      .liste()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  });

  return <div>Gallery</div>;
};

export default Gallery;
