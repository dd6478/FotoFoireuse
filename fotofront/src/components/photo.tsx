import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageComponent = () => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const accessToken = localStorage.getItem('access');
        const response = await axios.get('http://dd64.fr/api/photos/2/download/', {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const imageUrl = URL.createObjectURL(response.data);
        setImageUrl(imageUrl);
      } catch (error) {
        console.error('Error during image fetch:', error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div>
      {imageUrl && <img src={imageUrl} alt="Downloaded from the API" />}
    </div>
  );
};

export default ImageComponent;