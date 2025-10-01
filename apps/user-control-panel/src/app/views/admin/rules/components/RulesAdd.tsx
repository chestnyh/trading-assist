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
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Menu from '../../../../components/menu/MainMenu';
import JSONEditorDemo from './JSONeditor';

export default function RulesAdd() {
  const { addRule } = useRules();
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ruleBody: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await addRule(formData);
      if (success) {
        navigate('/admin/rules');
      } else {
        alert('Failed to create rule. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while creating the rule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/rules');
  };

  return (
    <Card flexDirection="column" w="100%" px="0px">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Add New Rule
        </Text>
        <Menu />
      </Flex>
      
      <Box p="25px">
        <VStack spacing="6" align="stretch">
          <FormControl isRequired>
            <FormLabel>Rule Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter rule name"
            />
          </FormControl>

          <FormControl isRequired>
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
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSave}
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Create Rule
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Card>
  );
}