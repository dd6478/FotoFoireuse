import React from "react";

const FotoIndex = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Centre horizontalement
        alignItems: "flex-start", // Aligne en haut
        height: "100vh", // Prend toute la hauteur de la fenêtre
        paddingTop: "20px", // Optionnel : un peu de marge en haut
      }}
    >
      <img
        src="/dragonSansFond-modified.png"
        alt="Dragon"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default FotoIndex;
