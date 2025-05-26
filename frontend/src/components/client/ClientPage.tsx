import { Plus, Search } from "lucide-react";
import { AddClientButton } from "./AddClientButton";
import ClientTable from "./ClientTable";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthRole } from "@/redux/auth/authSlice";
import { Button } from "../ui/button";

function ClientPage() {
  const role = useSelector(selectAuthRole);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);

  const handleSearch = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setSearchTerm(search)
  }

  return (
    <div className="flex flex-col p-4 space-y-4 w-[85vw]">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        <p className="text-lg font-bold">Clients</p>
        <div className="relative flex-1">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-grow">
              <Search className="absolute top-2.5 left-2.5 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="q"
                className="w-full h-10 pl-10 pr-4 rounded-l-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Search by Client Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="h-10 px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        {role !== "admin" && role !== "verifier" && (
          <Button
            onClick={() => setShowAddClient(true)}
            variant="outline"
            className="flex items-center"
          >
            <Plus className="mr-2" /> Add Client
          </Button>
        )}
      </div>

      <ClientTable searchTerm={searchTerm} role={role} />
      {showAddClient && (
        <AddClientButton onClose={() => setShowAddClient(false)} />
      )}
    </div>
  );
}

export default ClientPage;
