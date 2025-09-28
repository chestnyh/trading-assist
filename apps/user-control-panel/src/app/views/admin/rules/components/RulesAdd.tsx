/* eslint-disable */

import {
    Box,
    Text,
    Button,
} from '@chakra-ui/react';
import { useRules } from '../../../../contexts/RulesContext';
// Assets

export default function RulesAdd(props: any) {
    const { setMode } = useRules();
    // Sync local data with prop changes
    return (
        <Box>
            <Button onClick={() => setMode("table")}>Back</Button>
            <Text>Rules Detail</Text>
        </Box>
    );
}