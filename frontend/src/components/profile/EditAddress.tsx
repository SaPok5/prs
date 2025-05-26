import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";


export function EditAddress() {

    return (

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md justify-center text-sm">
                    <Edit className="mr-2" /> Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-center items-center mb-4">
                    <p className='text-lg font-bold'>Edit Address Info</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="countrty" className="text-sm font-medium">Countrt</label>
                        <input
                            type="text"
                            name="countrty"
                            id="countrty"
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Country"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="cityState" className="text-sm font-medium">City/State</label>
                        <input
                            type="text"
                            name="cityState"
                            id="cityState"

                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter City/State"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="clientName" className="text-sm font-medium">Postal Code</label>
                        <input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Postal Code"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="workType" className="text-sm font-medium">Tax ID</label>
                        <input
                            type="text"
                            name="Enter Tax ID"
                            id="Enter Tax ID"
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Enter Tax ID"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <DialogFooter>
                    <div className="flex justify-center space-x-6 mt-4">
                        <Button
                            className="border border-blue-500 text-blue-500 px-8 py-3 rounded-md w-48 text-sm font-medium"
                            variant="outline"
                            type="button"
                            onClick={() => console.log('Canceled')}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-500 text-white px-8 py-3 rounded-md w-48 text-sm font-medium"
                            type="submit"
                        >
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
