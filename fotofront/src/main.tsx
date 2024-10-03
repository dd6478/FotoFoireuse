import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";

const theme = extendTheme({
  fonts: {
    heading: "'MaPolicePersonnalisée', sans-serif",
    body: "'MaPolicePersonnalisée', sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
