import {
  IconButton,
  HStack,
  Text,
  background,
  MenuButton,
  Menu,
  Button,
  Avatar,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import userService from "../../services/user-service";
import { useLocation, useNavigate } from "react-router-dom";
import "./NavBar.css";
import {jwtDecode} from "jwt-decode";
import {set} from "zod";

interface JwtPayload {
  user_id: string;
}

const NavBar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  const isLogged = () => {
    return !(!localStorage.getItem("refresh") || jwtDecode(localStorage.getItem("refresh")).exp < Math.floor(Date.now() / 1000));
  }

  const getUser = async () : Promise<string> => {
    var userID = jwtDecode<JwtPayload>(localStorage.getItem("refresh"));
    try {
      const res = await userService.getUserName(userID.user_id);
      return res.data.username as string;
    } catch (error) {
      return "none";
    }
  }

  useEffect(() => {
  const fetchUser = async () => {
    if (isLogged()) {
      const userID = jwtDecode<JwtPayload>(localStorage.getItem("refresh"));
      try {
        const res = await userService.getUserName(userID.user_id);
        setUsername(res.data.username);
      } catch (error) {
        console.error(error);
      }
    }
  };

  fetchUser();

  if (!isLogged() && location.pathname !== "/" && location.pathname !== "/inscription") {
    navigate("/connexion");
  }
}, []);

  const isVisible =
    location.pathname === "/inscription" ||
    location.pathname === "/publication";

  const handleOnClick = () => {
    if ((location.pathname = "/inscription")) navigate("/");
    if ((location.pathname = "/publication")) navigate("/images");
  };

  return (
      <HStack
          width="100%"
          align="center"
          justifyContent="center"
          boxShadow="0px 3px 6px rgba(255, 255, 255, 0.2)"
          marginBottom="10px"
      >
        <IconButton
              aria-label="Home page"
              icon={<img
                  src="/viking.ico"
                  alt="Icone"
                  style={{width: "50px", height: "50px"}}
              />}
              width="50px"
              height="50px"
              background="transparent"
              onClick={() => navigate("/")}
        />
        <Text className="titre" flex="1" width="80%" textAlign="center">
          {" "}
          FotoFoireuses{" "}
        </Text>
        {isLogged() ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<Avatar name={username} src='' />} background={"transparent"} _hover={{ bg: 'transparent' }} _focus={{ bg: 'transparent' }} _expanded={{ bg: 'transparent' }}>
              </MenuButton>
              <MenuList>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
        ) : (
            <Button onClick={() => navigate("/connexion")}>Connexion</Button>

        )}
      </HStack>
  );
};

export default NavBar;
