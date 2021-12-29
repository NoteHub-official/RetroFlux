import { Box } from "@chakra-ui/react";
import * as React from "react";
import { Routes, Route } from "react-router-dom";
// Views
import Components from "./views/Components";
import Home from "./views/Home";

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/components" element={<Components />} />
      </Routes>
    </Box>
  );
}

export default App;
