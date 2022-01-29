import React from "react";
import { Box, Flex, Heading, IconButton, useColorModeValue } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useTheme } from "../hooks/useTheme";

export const NavigationBar: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const bg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const color = useColorModeValue("gray.600", "gray.100");

  return (
    <React.Fragment>
      <Flex
        w="full"
        h={14}
        px={3}
        bgColor={bg}
        pos="fixed"
        top={0}
        zIndex={10}
        justify="space-between"
        borderBottomColor={borderColor}
        borderWidth="1px"
      >
        <Flex align={"center"}>
          <Heading as="h1" size="lg" fontWeight={"medium"} color={color}>
            FluxEditor
          </Heading>
        </Flex>
        <Flex align={"center"}>
          <IconButton
            aria-label="toggle-theme"
            colorScheme="gray"
            bg="transparent"
            size="sm"
            onClick={() => toggleTheme()}
            boxShadow={"none"}
            _focus={{ boxShadow: "none", ring: 2 }}
            icon={theme === "light" ? <MoonIcon color={color} /> : <SunIcon color={color} />}
          ></IconButton>
        </Flex>
      </Flex>
      <Box w="full" h={14} mb={4}></Box>
    </React.Fragment>
  );
};
