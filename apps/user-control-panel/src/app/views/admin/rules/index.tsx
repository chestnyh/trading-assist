// Chakra imports
import { Box } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import RulesTable from "./components/RulesTable";
import RulesEdit from "./components/RulesEdit";
import RulesDetail from "./components/RulesDetail";
import RulesAdd from "./components/RulesAdd";
import { RulesProvider } from "../../../contexts/RulesContext";

function RulesContent() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Routes>
        <Route path="/" element={<RulesTable />} />
        <Route path="/add" element={<RulesAdd />} />
        <Route path="/:ruleId" element={<RulesDetail />} />
        <Route path="/:ruleId/edit" element={<RulesEdit />} />
        <Route path="*" element={<Navigate to="/admin/rules" replace />} />
      </Routes>
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
