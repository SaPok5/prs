// import { FiSearch } from 'react-icons/fi';
import { Plus, Search } from "lucide-react";
import AllButton from "../dashboard/AllButton";
import { AddDeal } from "@/components/deals/AddDeal";
import DealTable from "../deals/DealTable";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_USERS } from "@/graphql/query/user.query";
import { useSelector } from "react-redux";
import { selectAuthRole } from "@/redux/auth/authSlice";
import { Button } from "../ui/button";

function DealPage() {
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState<string | null>(null);
  const role = useSelector(selectAuthRole);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");

  const { data } = useQuery(ALL_USERS);
  const [showAddDealButton, setShowAddDealButton] = useState(false);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(search);
  };

  return (
    <div className="flex flex-col p-4 space-y-4 w-[85vw]">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        <p className="text-lg font-bold">Deals</p>
        <div className="relative flex-1 ">
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
        <AllButton setFilter={setFilter} />
        {role !== "admin" && role !== "verifier" ? (
          <Button
            onClick={() => setShowAddDealButton(true)}
            variant="outline"
            className="flex items-center"
          >
            <Plus className="mr-2" /> Add Deal
          </Button>
        ) : null}
        {role == "admin" ? (
          <div className="w-[180px]">
            <select
              className="w-full h-10 px-2 border border-gray-300 rounded"
              value={user || ""}
              onChange={(e) => setUser(e.target.value || null)}
            >
              <option value="">All</option>
              {data?.gettAllUsers.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <DealTable searchTerm={searchTerm} filter={filter} user={user} />
      {showAddDealButton && (
        <AddDeal onClose={() => setShowAddDealButton(false)} />
      )}
    </div>
  );
}

export default DealPage;
