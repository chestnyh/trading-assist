/* eslint-disable */

import {
  Box,
  Text,
  Button,
  Flex,
  useColorModeValue,
  Card,
  Divider,
  Badge,
} from '@chakra-ui/react';
// Custom components
import { useRules } from '../../../../contexts/RulesContext';
import Menu from '../../../../components/menu/MainMenu';
import { useNavigate, useParams } from 'react-router-dom';
// Assets

export default function RulesDetail(props: any) {
  const { selectedRule, rules } = useRules();
  const navigate = useNavigate();
  const { ruleId } = useParams();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  
  // Debug logging
  console.log('RulesDetail Debug:', { 
    selectedRule, 
    rules, 
    ruleId, 
    rulesLength: rules.length,
    rulesIds: rules.map(r => r.id),
    selectedRuleId: selectedRule?.id 
  });
  
  // Find the rule by ID from URL params
  const rule = selectedRule || rules.find(r => r.id.toString() === ruleId);

  if (!rule) {
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Rule Not Found
          </Text>
          <Menu />
        </Flex>
        <Box p="25px">
          <Text mb="4">Rule not found. Please check the URL or go back to the rules list.</Text>
          
          {/* Debug info */}
          <Box bg="gray.100" p="4" borderRadius="md" mb="4">
            <Text fontSize="sm" fontWeight="bold" mb="2">Debug Info:</Text>
            <Text fontSize="xs">RuleId from URL: {ruleId}</Text>
            <Text fontSize="xs">Selected Rule: {selectedRule ? 'Yes' : 'No'}</Text>
            <Text fontSize="xs">Rules count: {rules.length}</Text>
            <Text fontSize="xs">Rules: {JSON.stringify(rules, null, 2)}</Text>
          </Box>
          
          <Button mt="4" onClick={() => navigate('/admin/rules')}>
            Back to Rules
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Rule Details
        </Text>
        <Flex gap="8px" align="center">
          <Button 
            colorScheme="green" 
            onClick={() => navigate(`/admin/rules/${rule.id}/edit`)}
            leftIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            }
          >
            Edit Rule
          </Button>
          <Menu />
        </Flex>
      </Flex>
      
      <Box p="25px">
        <Flex direction="column" gap="6">
          {/* Rule Name */}
          <Box>
            <Text fontSize="sm" color="gray.500" mb="2">Rule Name</Text>
            <Text fontSize="lg" fontWeight="600" color={textColor}>
              {rule.name}
            </Text>
          </Box>

          <Divider />

          {/* Status */}
          <Box>
            <Text fontSize="sm" color="gray.500" mb="2">Status</Text>
            <Badge colorScheme="green" fontSize="sm">
              Active
            </Badge>
          </Box>

          <Divider />

          {/* Description */}
          <Box>
            <Text fontSize="sm" color="gray.500" mb="2">Description</Text>
            <Text color={textColor}>
              {rule.description}
            </Text>
          </Box>

          <Divider />

          {/* Rule Body */}
          <Box>
            <Text fontSize="sm" color="gray.500" mb="2">Rule Body</Text>
            <Box 
              bg="gray.50" 
              p="4" 
              borderRadius="md" 
              border="1px solid" 
              borderColor="gray.200"
              maxH="400px"
              overflowY="auto"
            >
              <pre style={{ 
                color: 'black',
                margin: 0, 
                fontSize: '12px', 
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {JSON.stringify(rule.ruleBody, null, 2)}
              </pre>
            </Box>
          </Box>

          {/* Back Button */}
          <Flex justify="flex-start" mt="6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/rules')}
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              }
            >
              Back to Rules
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Card>
  );
}