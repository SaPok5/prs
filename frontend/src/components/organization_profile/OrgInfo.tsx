// import React, { useState } from 'react';
// import { Edit } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { useMutation } from '@apollo/client';
// import { Edit_OrgInfo_Status } from '@/graphql/mutations';
// import girl from "@/assets/girl.jpg"

// export function OrgInfo() {
//     const [organizationName, setorganizationName] = useState<string>('');
//     const [email, setemail] = useState<string>('');
//     const [errorMessage, setErrorMessage] = useState<string>('');
//     const [editOrgProfile] = useMutation(Edit_OrgInfo_Status);


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!organizationName || !email) {
//             setErrorMessage("Please fill in all the fields.");
//             return;
//         }

//         try {
//             const input = {
//                 organizationName: organizationName,
//                 email: email,
//             };

//             const response = await editOrgProfile({ variables: { input } });

//             if (response.data?.editOrganizationProfile?.status?.success) {
//                 alert("Organization profile updated successfully.");
//                 setorganizationName('');
//                 setemail('');
//                 setErrorMessage('');
//             } else {
//                 setErrorMessage("Failed to update profile. Please try again.");
//             }
//         } catch (err) {
//             setErrorMessage("An error occurred while updating the profile.");
//             console.error("Error:", err);
//         }
//     };

//     return (
//         <Dialog>
//             <DialogTrigger asChild>
//                 <Button variant="outline" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm">
//                     <Edit className="mr-2" /> Edit
//                 </Button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
//                 <form onSubmit={handleSubmit}>
//                     <div className="flex justify-center items-center mb-8">
//                         <div className="relative w-24 h-24">
//                             <img
//                                 src={girl}
//                                 alt="Girl"
//                                 className=" w-full h-full rounded-full object-cover mb-4"
//                             />
//                             <input
//                                 type="file"
//                                 id="profilePic"
//                                 className="hidden"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => document.getElementById('profilePic')?.click()}
//                                 className="absolute bottom-0 right-0 bg-gray-700 text-white p-1 rounded-full hover:bg-gray-600 transition"
//                             >
//                                 <Edit className="w-4 h-4" />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Organization Info */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="flex flex-col">
//                             <label htmlFor="organizationName" className="text-sm font-medium">Organization Name</label>
//                             <input
//                                 type="text"
//                                 id="organizationName"
//                                 value={organizationName}
//                                 onChange={(e) => setorganizationName(e.target.value)}
//                                 className="w-full h-10 border p-2 rounded-md"
//                                 placeholder="Organization Name"
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <label htmlFor="email" className="text-sm font-medium">Organization Email</label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 value={email}
//                                 onChange={(e) => setemail(e.target.value)}
//                                 className="w-full h-10 border p-2 rounded-md"
//                                 placeholder="Organization Email"
//                             />
//                         </div>
//                     </div>

//                     {errorMessage && (
//                         <div className="text-red-500 mt-2">{errorMessage}</div>
//                     )}

//                     {/* Action Buttons */}
//                     <DialogFooter>
//                         <div className="flex justify-center space-x-6 mt-4">
//                             <Button
//                                 className="border border-blue-500 text-blue-500 px-8 py-3 rounded-md w-48 text-sm font-medium"
//                                 variant="outline"
//                                 type="button"
//                                 onClick={() => console.log('Canceled')}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 className="bg-blue-500 text-white px-8 py-3 rounded-md w-48 text-sm font-medium"
//                                 type="submit"
//                             >
//                                 Save
//                             </Button>
//                         </div>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }



import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useQuery } from '@apollo/client';
import { GET_ORGANIZATION_BY_ID } from "@/graphql/queries";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
} from "@/components/ui/alert-dialog";
import { useMutation } from '@apollo/client';
import { Edit_OrgInfo_Status } from '@/graphql/mutations';
import girl from "@/assets/girl.jpg";
import { useSelector } from 'react-redux';
import { selectOrganizationId } from '@/redux/auth/authSlice';

export function OrgInfo() {
    const [organizationName, setOrganizationName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
    const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
    const [editOrgProfile] = useMutation(Edit_OrgInfo_Status);
    const orgId = useSelector(selectOrganizationId)

    const { refetch } = useQuery(GET_ORGANIZATION_BY_ID, {
        variables: { orgId },
    });
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!organizationName || !email) {
            setErrorMessage("Please fill in all the fields.");
            setShowErrorDialog(true);
            return;
        }
    
        try {
            const input = {
                organizationName,
                email,
            };
    
            const response = await editOrgProfile({ variables: { input } });
            console.log(response);
    
           
            await refetch();
    
            setShowSuccessDialog(true);
            setOrganizationName('');
            setEmail('');
            setErrorMessage('');
        } catch (err) {
            setErrorMessage("An error occurred while updating the profile.");
            setShowErrorDialog(true);
            console.error("Error:", err);
        }
    };
    
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md">
                        <Edit className="mr-2" /> Edit
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center items-center mb-8">
                            <div className="relative w-24 h-24">
                                <img
                                    src={girl}
                                    alt="Girl"
                                    className="w-full h-full rounded-full object-cover mb-4"
                                />
                                <input
                                    type="file"
                                    id="profilePic"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('profilePic')?.click()}
                                    className="absolute bottom-0 right-0 bg-gray-700 text-white p-1 rounded-full hover:bg-gray-600 transition"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Organization Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="organizationName" className="text-sm font-medium">Organization Name</label>
                                <input
                                    type="text"
                                    id="organizationName"
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    className="w-full h-10 border p-2 rounded-md"
                                    placeholder="Organization Name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-sm font-medium">Organization Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-10 border p-2 rounded-md"
                                    placeholder="OrganizationEmail"
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
                    </form>
                </DialogContent>
            </Dialog>

            {/* Success Alert Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Profile Updated Successfully</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your organization profile has been updated with the new information.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Error Alert Dialog */}
            <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error</AlertDialogTitle>
                        <AlertDialogDescription>
                            {errorMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
                            Okay
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}