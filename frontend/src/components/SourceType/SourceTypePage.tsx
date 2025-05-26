import { useQuery, useMutation } from "@apollo/client";
import { Search, Trash } from "lucide-react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../ui/table";
import { CreateSourceType } from "@/models/CreateSourceType";
import { EditSourceType } from "@/models/EditSourceType";
import { useState } from "react";
import {
  GET_SOURCE_TYPE,
  DELETE_SOURCE_TYPE,
} from "../../graphql/query/source-type.query";

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

interface SourceType {
  id: string;
  name: string;
  description: string;
}

const SourceTypePage = () => {
  const { loading, error, data, refetch } = useQuery(GET_SOURCE_TYPE);
  const [deleteSourceType, { loading: deleting }] =
    useMutation(DELETE_SOURCE_TYPE);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [selectedSourceTypeId, setSelectedSourceTypeId] = useState<
    string | null
  >(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading source types: {error.message}</div>;

  const sourceTypes = data?.sourceTypes?.data || [];
  const filteredSourceTypes = sourceTypes.filter((sourceType: SourceType) =>
    sourceType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (sourceTypeId: string) => {
    setSelectedSourceTypeId(sourceTypeId);
    setDialogMessage("Are you sure you want to delete this source type?");
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSourceTypeId) return;

    try {
      await deleteSourceType({
        variables: { deleteSourceTypeId: selectedSourceTypeId },
      });
      refetch();
      setDialogMessage("Source type deleted successfully.");
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Error deleting source type:", err);
      setDialogMessage(
        "An unexpected error occurred while deleting the source type."
      );
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 mx-4 space-y-4 sm:space-y-0">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search source types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px] sm:w-[400px] pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <CreateSourceType refetch={refetch} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <thead className="bg-gray-200">
                <TableRow>
                  <TableHead className="px-4 py-4 text-sm">S.N.</TableHead>
                  <TableHead className="px-4 py-4 text-left text-sm">
                    Source Type Name
                  </TableHead>
                  <TableHead className="px-4 py-4 text-sm">
                    Description
                  </TableHead>
                  <TableHead className="px-4 py-4 text-sm">Action</TableHead>
                </TableRow>
              </thead>
              <TableBody className="divide-y divide-gray-200">
                {filteredSourceTypes.map(
                  (sourceType: SourceType, idx: number) => (
                    <TableRow key={sourceType.id}>
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700 text-left">
                        {sourceType.name}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700">
                        {sourceType.description}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-gray-700 flex items-center space-x-2">
                        {sourceType.id &&
                        typeof sourceType.id === "string" &&
                        sourceType.name ? (
                          <EditSourceType
                            id={sourceType.id}
                            initialSourceTypeName={sourceType.name}
                            initialDescription={sourceType.description}
                          />
                        ) : (
                          <div>Invalid ID or Name</div>
                        )}
                        <Button
                          onClick={() => handleDelete(sourceType.id)}
                          variant="ghost"
                          size="sm"
                          disabled={deleting}
                        >
                          <Trash className="h-4 w-4  text-red-500 hover:text-red-700" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
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
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Close
            </AlertDialogCancel>
            {dialogMessage ===
              "Are you sure you want to delete this source type?" && (
              <AlertDialogAction onClick={confirmDelete}>
                Confirm
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SourceTypePage;
