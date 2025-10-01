/* eslint-disable */

import {
  Box,
  Text,
  Button,
  Flex,
  useColorModeValue,
  Card,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useRules } from '../../../../contexts/RulesContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Menu from '../../../../components/menu/MainMenu';
import JSONEditorDemo from './JSONeditor';

export default function RulesEdit() {
  const { rules, updateRule } = useRules();
  const navigate = useNavigate();
  const { ruleId } = useParams();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ruleBody: {}
  });

  // Find the rule by ID
  const rule = rules.find(r => r.id.toString() === ruleId);

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        ruleBody: rule.ruleBody
      });
    }
  }, [rule]);

  const handleSave = async () => {
    if (ruleId) {
      const success = await updateRule(ruleId, formData);
      if (success) {
        navigate(`/admin/rules/${ruleId}`);
      }
    }
  };

  const handleCancel = () => {
    navigate(`/admin/rules/${ruleId}`);
  };

  if (!rule) {
    return (
      <Card flexDirection="column" w="100%" px="0px">
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700">
            Rule Not Found
          </Text>
          <Menu />
        </Flex>
        <Box p="25px">
          <Text>Rule not found. Please check the URL.</Text>
          <Button mt="4" onClick={() => navigate('/admin/rules')}>
            Back to Rules
          </Button>
        </Box>
      </Card>
    );
  }

  return (
    <Card flexDirection="column" w="100%" px="0px">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Edit Rule: {rule.name}
        </Text>
        <Menu />
      </Flex>
      
      <Box p="25px">
        <VStack spacing="6" align="stretch">
          <FormControl>
            <FormLabel>Rule Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter rule name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter rule description"
              rows={3}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Rule Body (JSON)</FormLabel>
            <JSONEditorDemo
                json={formData.ruleBody} 
                onChangeJSON={(json) => setFormData({...formData, ruleBody: json})} 
              />
          </FormControl>
          <Flex gap="4" justify="flex-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save Changes
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Card>
  );
}