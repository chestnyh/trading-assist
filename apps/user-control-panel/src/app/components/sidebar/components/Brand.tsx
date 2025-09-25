// Chakra imports
import { Flex, Text } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "../../../components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode

  return (
    <Flex align='center' direction='column'>
      <Text fontSize='3xl' fontWeight='bold'>
        Trading Bot
      </Text>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
