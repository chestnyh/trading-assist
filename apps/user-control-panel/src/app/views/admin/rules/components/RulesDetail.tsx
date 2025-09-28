/* eslint-disable */

import {
  Box,
  Text,
  Button,
} from '@chakra-ui/react';
// Custom components
import { useRules } from '../../../../contexts/RulesContext';
// Assets

export default function RulesDetil(props: any) {
  // Sync local data with prop changes
  const { setMode } = useRules();
  return (
    <Box>
      <Button onClick={() => setMode("table")}>Back</Button>
      <Text>Rules Detail</Text>
    </Box>
  );
}