import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { GET_ALL_TEAMS } from "@/graphql/query/teams.query";
import { SWITCH_USER_TEAM } from '@/graphql/mutations';
import { useQuery, useMutation } from "@apollo/client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProps {
    userId: string;
}

const SwitchTeam: React.FC<UserProps> = ({ userId }) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [selectedTeam, setSelectedTeam] = React.useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    // Fetch all teams using the query
    const { loading, error, data } = useQuery(GET_ALL_TEAMS);

    // Define mutation
    const [switchUserTeam] = useMutation(SWITCH_USER_TEAM);

    // Handle team selection
    const handleTeamSelect = (teamName: string) => {
        setSelectedTeam(teamName); // Set the selected team
        setIsDialogOpen(true); // Open the confirmation dialog
    };

    // Confirm team switch
    const confirmSwitchTeam = async () => {
        if (selectedTeam) {
            const selectedTeamObj = data?.allTeams.find((team: any) => team.teamName === selectedTeam);
            if (selectedTeamObj) {
                try {
                    const { data } = await switchUserTeam({
                        variables: {
                            input: {
                                teamId: selectedTeamObj.id,
                                userId: userId,
                            }
                        }
                    });

                    if (data?.switchUserTeam?.status?.success) {
                        setValue(selectedTeam); // Update the value to the selected team
                    }
                } catch (error) {
                    console.error("Error switching team:", error);
                }
            }
        }
        setIsDialogOpen(false); // Close the dialog after confirming
    };

    // Show loading or error states for fetching teams
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const teams = data?.allTeams || [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[130px] justify-between relative right-24"
                >
                    {value
                        ? teams.find((team: any) => team.teamName === value)?.teamName || "Select team..."
                        : "Select team..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search team..." />
                    <CommandList>
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup>
                            {teams.map((team: any) => (
                                <CommandItem
                                    key={team.id}
                                    value={team.teamName}
                                    onSelect={() => handleTeamSelect(team.teamName)}
                                >
                                    {team.teamName}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === team.teamName ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to switch teams?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will switch the user to the selected team. Please confirm.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSwitchTeam}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Popover>
    );
}

export default SwitchTeam;