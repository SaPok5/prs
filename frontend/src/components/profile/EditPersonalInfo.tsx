import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";


export function EditPersonalInfo() {

    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string); 
            };
            reader.readAsDataURL(file); 
        }
    };
    return (

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm">
                    <Edit className="mr-2" /> Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-center items-center mb-8">
                    <div className="relative w-24 h-24">
                        <img
                            src={profileImage || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                        <input
                            type="file"
                            id="profilePic"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <button
                            onClick={() => document.getElementById('profilePic')?.click()}
                            className="absolute bottom-0 right-0 bg-gray-700 text-white p-1 rounded-full hover:bg-gray-600 transition"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                    {/* S.No. and Deal Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"

                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    {/* Client Name and Work Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="clientName" className="text-sm font-medium">Email Address</label>
                            <input
                                type="text"
                                name="emailAddress"
                                id="emailAddress"
                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="workType" className="text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                name="phoneNo"
                                id="phoneNo"
                                className="w-full h-10 border p-2 rounded-md"
                                placeholder="Phone No"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="workType" className="text-sm font-medium">Bio</label>
                        <input
                            type="text"
                            name="bio"
                            id="bio"
                            className="w-full h-10 border p-2 rounded-md"
                            placeholder="Bio"
                        />
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
