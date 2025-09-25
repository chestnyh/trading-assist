// Chakra imports
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Footer from "../../components/footer/FooterAuth";
import FixedPlugin from "../../components/fixedPlugin/FixedPlugin";

function AuthIllustration(props: any) {
  const { children } = props;
  // Chakra color mode
  return (
    <Flex
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      h="auto"
      w="100%"
      maxW={{ md: "66%", lg: "1313px" }}
      mx="auto"
      pt={{ sm: "50px", md: "0px" }}
      px={{ lg: "30px", xl: "0px" }}
      ps={{ xl: "70px" }}
      justifyContent="center"
      alignItems="center"
      direction="column"
      zIndex={10}
    >
      <Flex
        w="100%"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {children}
        <Footer />
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}
// PROPS

AuthIllustration.propTypes = {
  children: PropTypes.node,
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
