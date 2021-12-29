import React from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import {
  useColorModeValue,
  Box,
  Text,
  Button,
  Input,
  Divider,
  InputGroup,
  InputLeftElement,
  InputLeftAddon,
} from "@chakra-ui/react";
import { PhoneIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";

const Components: React.FC = () => {
  const bg = useColorModeValue("brand.100", "brand.900");
  const text = useColorModeValue("brand.900", "brand.100");

  return (
    <div>
      <Box
        bg={bg}
        className="fixed h-[4.75rem] w-full border-b-[1px]
        flex justify-between items-center px-4 color-nav color-divider z-10"
      >
        <Text className="text-2xl font-medium italic" color={text}>
          Component Reference
        </Text>
        <ColorModeSwitcher />
      </Box>
      <nav className="h-[4.75rem]"></nav>
      <div className="container mx-auto mt-4 px-4 max-w-6xl h-screen">
        <Button colorScheme="red" variant="outline" className="btn-ring">
          Click Me
        </Button>
        <Button colorScheme="zinc" className="btn-ring" ml={4}>
          Click Me
        </Button>
        <Button ml={4}>Click Me</Button>
        <Divider my={4}></Divider>
        <InputGroup size="lg" mb={4}>
          <InputLeftElement color={"gray.400"} children={<PhoneIcon />} />
          <Input
            placeholder="Please enter..."
            w={300}
            colorScheme={"yellow"}
            className="input-ring"
          ></Input>
        </InputGroup>
        <InputGroup size="lg" mb={4}>
          <InputLeftAddon color={"gray.400"} children={<WarningIcon />} />
          <Input type="date" placeholder="Please enter..." w={300}></Input>
        </InputGroup>
      </div>
    </div>
  );
};

export default Components;
