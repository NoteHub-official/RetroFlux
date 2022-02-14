import React from "react";
import { Box, Container } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { FluxEditor } from "../editor/FluxEditor";
import { WsEditor } from "../editor/WsEditor";
import { NavigationBar } from "../components/NavigationBar";

const Home: React.FC = () => {
  const bg = useColorModeValue("zinc.50", "whiteAlpha");

  return (
    <Box bg={bg} minh="100vh">
      <NavigationBar />
      <Container maxW="container.lg">
        <Box>
          <FluxEditor />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
