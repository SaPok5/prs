import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GET_TOTAL_AMOUNT_OF_EMPLOYEE_IN_MONTH } from "@/graphql/query/sales.query";
import { useQuery } from "@apollo/client";

const DashboardV2 = () => {
  const {data,loading} = useQuery(GET_TOTAL_AMOUNT_OF_EMPLOYEE_IN_MONTH)
  if(loading)
    return <div>Loading...</div>
  
  console.log(data)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default DashboardV2;
