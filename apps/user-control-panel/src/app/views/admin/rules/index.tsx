// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import ComplexTable from "./components/ComplexTable";
import {
  columnsDataComplex,
} from "./variables/columnsData";
import tableDataComplex from "../../../views/admin/dataTables/variables/tableDataComplex.json";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
    </Box>
  );
}
