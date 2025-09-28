/* eslint-disable */

import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Checkbox,
  Button,
} from '@chakra-ui/react';
// Custom components
import Card from '../../../../components/card/Card';
import Menu from '../../../../components/menu/MainMenu';
import { useRules } from '../../../../contexts/RulesContext';
// Assets

export default function RulesTable(props: any) {

  const { rules, setMode, setSelectedRule, deleteRule } = useRules();

  const textColor = useColorModeValue('secondaryGray.900', 'white');

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
          Rules Table
        </Text>
        <Menu />
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            <Tr>
              <Th
                pe="10px"
                cursor="pointer"
              >
                <Checkbox
                  colorScheme="brandScheme"
                  me="10px"
                />
              </Th>
              <Th>
                <Text
                  justifyContent="space-between"
                  align="center"
                  fontSize={{ sm: '10px', lg: '12px' }}
                  color="gray.400"
                >
                  NAME
                </Text>
              </Th>
              <Th>
                <Text
                  justifyContent="space-between"
                  align="center"
                  fontSize={{ sm: '10px', lg: '12px' }}
                  color="gray.400"
                >
                  STATUS
                </Text>
              </Th>
              <Th>
                <Text
                  justifyContent="space-between"
                  align="center"
                  fontSize={{ sm: '10px', lg: '12px' }}
                  color="gray.400"
                >
                  DESCRIPTION
                </Text>
              </Th>
              <Th>
                <Text
                  justifyContent="space-between"
                  align="center"
                  fontSize={{ sm: '10px', lg: '12px' }}
                  color="gray.400"
                >
                  RULE BODY
                </Text>
              </Th>
              <Th>
                <Text
                  justifyContent="space-between"
                  align="center"
                  fontSize={{ sm: '10px', lg: '12px' }}
                  color="gray.400"
                >
                  ACTIONS</Text>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rules
              .map((row) => {
                return (
                  <Tr key={row.id}>
                    <Td
                      borderColor="transparent"
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    >
                      <Checkbox
                        defaultChecked={row.status}
                        colorScheme="brandScheme"
                        me="10px"
                      />
                    </Td>
                    <Td fontSize={{ sm: '14px' }}
                      borderColor="transparent"
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    >
                      <Text onClick={() => { setMode("detail"); setSelectedRule(row); }}>{row.name}</Text>
                    </Td>
                    <Td fontSize={{ sm: '14px' }}
                      borderColor="transparent"
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    >
                      Active
                    </Td>
                    <Td fontSize={{ sm: '14px' }}
                      borderColor="transparent"
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    >
                      {row.description}
                    </Td>
                    <Td fontSize={{ sm: '14px' }}
                      borderColor="transparent"
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    >
                      {JSON.stringify(row.ruleBody, null, 2)}
                    </Td>
                    <Td borderColor="transparent">
                      <Flex gap="8px">
                        <Button
                          colorScheme="blue"
                          onClick={() => { setMode("detail"); setSelectedRule(row); }}
                          leftIcon={
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          }
                        >
                        </Button>
                        <Button
                          colorScheme="green"
                          onClick={() => { setMode("edit"); setSelectedRule(row); }}
                          leftIcon={
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          }
                        >
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => deleteRule(row.id)}
                          leftIcon={
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6" />
                              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          }
                        >
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
