import { useState } from "react";
import { Eye, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@apollo/client";
import { CLIENTS } from "@/graphql/queries";
import { useNavigate } from "react-router-dom";
import EditClient from "./EditClient";

interface Client {
  clientId: string;
  contact: string;
  email: string;
  fullName: string;
  id: string;
  nationality: string;
  createdAt: string;
  isEdited?: boolean;
}

interface ClientTableProps {
  searchTerm: string;
  role: string | null;
}

const ClientTable: React.FC<ClientTableProps> = ({ searchTerm, role }) => {
  const [showEditClient, setShowEditClient] = useState({
    clientId: "",
    show: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(CLIENTS, {
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      searchTerm: searchTerm || undefined,
    },
    fetchPolicy: "network-only",
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        Error fetching clients: {error.message}
      </div>
    );

  const clients: Client[] = data.clients.clients || [];

  // const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const totalPages = data.clients.totalPages || 0;
  const totalClients = data.clients.totalCount || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleEditClient = (id: string) => {
    setShowEditClient({
      clientId: id,
      show: true,
    });
  };

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="py-4 px-6 text-xs font-medium text-gray-500">
                CLIENT ID
              </TableHead>
              <TableHead className="py-4 px-6 text-xs font-medium text-gray-500">
                CLIENT NAME
              </TableHead>
              <TableHead className="py-4 px-6 text-xs font-medium text-gray-500">
                NATIONALITY
              </TableHead>
              <TableHead className="py-4 px-6 text-xs font-medium text-gray-500">
                EMAIL
              </TableHead>
              <TableHead className="py-4 px-6 text-xs font-medium text-gray-500">
                PHONE NUMBER
              </TableHead>
              <TableHead className="py-4 px-6 text-xs font-medium text-gray-500 hidden md:table-cell">
                ADDED DATE
              </TableHead>
              <TableHead className="py-4 px-6 text-xs font-medium text-gray-500 ">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client: Client) => (
                <TableRow
                  key={client.clientId}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="py-4 px-6">
                    <span className="font-medium text-gray-900">
                      {client.clientId}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="font-medium text-gray-900">
                      {client.fullName}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-700">{client.nationality}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-700">{client.email}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-gray-700">{client.contact}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6 hidden md:table-cell">
                    <span className="text-gray-700">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center  gap-2">
                      <Button
                        onClick={() => navigate(`/clientDetails/${client.id}`)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </Button>
                      {role !== "admin" && role !== "verifyer" && (
                        <Button
                          onClick={() => handleEditClient(client.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </Button>
                      )}
                      {client.isEdited && (
                        <span className="text-xs text-gray-500 font-medium">
                          (edited)
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <span className="text-sm">No results found</span>
                    <span className="text-xs mt-1">
                      Try adjusting your search criteria
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(endIndex, totalClients)}
              </span>{" "}
              of <span className="font-medium">{totalClients}</span> results
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  onClick={() => setCurrentPage(1)}
                  variant={currentPage === 1 ? "default" : "ghost"}
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    currentPage === 1
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  1
                </Button>

                {currentPage > 3 && <span className="px-2">...</span>}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map(
                    (page) =>
                      page !== 1 &&
                      page !== totalPages && (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          className={`h-8 w-8 p-0 ${
                            currentPage === page
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </Button>
                      )
                  )}

                {currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}

                {totalPages > 1 && (
                  <Button
                    onClick={() => setCurrentPage(totalPages)}
                    variant={currentPage === totalPages ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {totalPages}
                  </Button>
                )}
              </div>

              <Button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditClient.show && (
        <EditClient
          onClose={() => setShowEditClient({ ...showEditClient, show: false })}
          clientId={showEditClient.clientId}
        />
      )}
    </div>
  );
};

export default ClientTable;
