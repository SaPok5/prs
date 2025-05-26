import { useQuery, useMutation } from "@apollo/client";
import { Search, Trash } from "lucide-react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import { CreateWorkType } from "@/models/CreateWorkType";
import { EditWorkType } from "@/models/editWorkType";
import {
  useState,
} from "react";
import {
  GET_WORKTYPES,
  DELETE_WORK_TYPE,
} from "../../graphql/query/work-type.query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface WorkType {
  id: string;
  name: string;
  description: string;
}

const WorkTypePage = () => {
  const { loading, error, data, refetch } = useQuery(GET_WORKTYPES);
  const [deleteWorkType, { loading: deleting }] = useMutation(DELETE_WORK_TYPE);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [selectedWorkTypeId, setSelectedWorkTypeId] = useState<string | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading work types: {error.message}</div>;

  const workTypes = data?.workTypes?.data || [];
  const filteredWorkTypes = workTypes.filter((workType: WorkType) =>
    workType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (workTypeId: string) => {
    setSelectedWorkTypeId(workTypeId);
    setDialogMessage('Are you sure you want to delete this work type?');
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedWorkTypeId) return;

    try {
      await deleteWorkType({
        variables: { workTypeId: selectedWorkTypeId },
      });
      refetch();
      setDialogMessage('Work type deleted successfully.');
      setIsDialogOpen(true);
    } catch (err) {
      console.error('Error deleting work type:', err);
      setDialogMessage('An unexpected error occurred while deleting the work type.');
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8 mx-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search work types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <CreateWorkType refetch={refetch} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4">
  <div className="overflow-x-auto">
    <Table className="w-full table-auto sm:table-fixed">
      <thead className="bg-gray-200">
        <TableRow>
          <TableHead className="px-4 py-4 text-sm sm:px-8">S.N.</TableHead>
          <TableHead className="px-4 py-4 text-sm sm:px-8 sm:pl-[151px] text-left">Work Type Name</TableHead>
          <TableHead className="px-4 py-4 text-sm sm:px-8">Description</TableHead>
          <TableHead className="px-4 py-4 text-sm sm:px-8">Action</TableHead>
        </TableRow>
      </thead>
      <TableBody className="divide-y divide-gray-200">
        {filteredWorkTypes.map((workType: WorkType, idx: number) => (
          <TableRow key={workType.id}>
            <TableCell className="px-4 py-4 text-sm sm:px-8 text-gray-700">
              {idx + 1}
            </TableCell>
            <TableCell className="px-4 py-4 text-sm sm:px-8 sm:pl-[151px] text-gray-700 text-left">
              {workType.name}
            </TableCell>
            <TableCell className="px-4 py-4 text-sm sm:px-8 text-gray-700">
              {workType.description}
            </TableCell>
            <TableCell className="px-4 py-4 text-sm sm:px-8 text-gray-700 flex items-center space-x-2">
              {workType.id && typeof workType.id === 'string' && workType.name ? (
                <EditWorkType
                  id={workType.id}
                  initialWorkTypeName={workType.name}
                  initialDescription={workType.description}
                />
              ) : (
                <div>Invalid ID or Name</div>
              )}

              <Button
              variant="ghost"
              size="sm"
                onClick={() => handleDelete(workType.id)}
                disabled={deleting}
              >
               <Trash className="h-4 w-4  text-red-500 hover:text-red-700" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>




      </div>

      {/* AlertDialog for showing confirmation, success, and error messages */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogMessage}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Close</AlertDialogCancel>
            {dialogMessage === 'Are you sure you want to delete this work type?' && (
              <AlertDialogAction onClick={confirmDelete}>Confirm</AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkTypePage;
