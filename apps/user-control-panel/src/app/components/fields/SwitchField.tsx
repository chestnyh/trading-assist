// Chakra imports
import {
  Box,
  Flex,
  FormLabel,
  Switch,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
// Custom components
import React from "react";

export default function Default(props: any) {
  const {
    id,
    label,
    isChecked,
    onChange,
    desc,
    textWidth,
    reversed,
    fontSize,
    ...rest
  } = props;
  const [checked, setChecked] = React.useState(isChecked);
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box w="100%" fontWeight="500" {...rest}>
      {reversed ? (
        <Flex align="center" borderRadius="16px">
          {isChecked ? (
            <Switch
              isChecked={checked}
              id={id}
              variant="main"
              colorScheme="brandScheme"
              size="md"
              onChange={() => setChecked(!checked)}
            />
          ) : (
            <Switch
              id={id}
              variant="main"
              colorScheme="brandScheme"
              size="md"
            />
          )}
          <FormLabel
            ms="15px"
            htmlFor={id}
            _hover={{ cursor: "pointer" }}
            mb="0px"
            maxW={textWidth ? textWidth : "75%"}
          >
            <Flex direction="column">
              <Text color={textColorPrimary} fontSize="md" fontWeight="500">
                {label}
              </Text>
              <Text
                color="secondaryGray.600"
                fontSize={fontSize ? fontSize : "md"}
              >
                {desc}
              </Text>
            </Flex>
          </FormLabel>
        </Flex>
      ) : (
        <Flex justify="space-between" align="center" borderRadius="16px">
          <FormLabel
            htmlFor={id}
            _hover={{ cursor: "pointer" }}
            maxW={textWidth ? textWidth : "75%"}
          >
            <Flex direction="column">
              <Text color={textColorPrimary} fontSize="md" fontWeight="500">
                {label}
              </Text>
              <Text
                color="secondaryGray.600"
                fontSize={fontSize ? fontSize : "md"}
              >
                {desc}
              </Text>
            </Flex>
          </FormLabel>
          {isChecked && onChange ? (
            <Switch
              isChecked={isChecked}
              id={id}
              variant="main"
              colorScheme="brandScheme"
              size="md"
              onChange={onChange}
            />
          ) : (
            <Switch
              id={id}
              variant="main"
              colorScheme="brandScheme"
              size="md"
            />
          )}
        </Flex>
      )}
    </Box>
  );
}
