// Chakra imports
import { Box } from "@chakra-ui/react";
import RulesTable from "./components/RulesTable";
import RulesEdit from "./components/RulesEdit";
import RulesDetail from "./components/RulesDetail";
import RulesAdd from "./components/RulesAdd";
import { RulesProvider, useRules, Rule } from "../../../contexts/RulesContext";
import { useState, useEffect } from "react";

function RulesContent() {
  const { rules, mode } = useRules();
  const [ tableData, setTableData ] = useState<Rule[]>([]);

  useEffect(() => {
    setTableData(rules);
  }, [rules]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        {mode === "table" && <RulesTable tableData={tableData} />}
        {mode === "edit" && <RulesEdit />}
        {mode === "detail" && <RulesDetail />}
        {mode === "add" && <RulesAdd />}
    </Box>
  );
}

export default function Rules() {
  return (
    <RulesProvider>
      <RulesContent />
    </RulesProvider>
  );
}
