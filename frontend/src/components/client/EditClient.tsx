import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { EDIT_CLIENT } from '@/graphql/mutations';
import { GET_CLIENTS_BY_ID } from '@/graphql/queries';
import { CLIENTS } from "@/graphql/queries"; 

interface ClientProps {
    clientId: string;
    onClose:any;
}

const EditClient: React.FC<ClientProps> = ({ clientId,onClose }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState('');

    const { data, loading, error } = useQuery(GET_CLIENTS_BY_ID, {
        variables: { clientId },
    });

    const [clientData, setClientData] = useState({
        clientId: '',        
        fullName: '',        
        nationality: '',
        email: '',
        contact: '',          
        id: ''                
    });

    const [editClient, { loading: mutationLoading }] = useMutation(EDIT_CLIENT, {
        onCompleted: (data) => {
            if (data.editClient.status.success) {
                setAlertType('success');
                setAlertMessage("Client edited successfully!");
                setShowAlert(true);
                onClose()
            }
        },
        onError: (err) => {
            console.error(err);
            setAlertType('error');
            setAlertMessage("An error occurred while editing the client.");
            setShowAlert(true);
        },
        refetchQueries: [
            { query: CLIENTS },
        ],
    });
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        editClient({
            variables: {
                input: {
                    clientId: clientData.clientId,
                    fullName: clientData.fullName,
                    nationality: clientData.nationality,
                    email: clientData.email,
                    contact: clientData.contact,
                    id: clientData.id,
                },
            },
            update: (cache, { data }) => {
                if (data?.editClient?.status?.success) {
                    const normalizedId = cache.identify({
                        id: clientData.id,
                        __typename: 'Client',
                    });
        
                    cache.modify({
                        id: normalizedId,
                        fields: {
                            isEdited: () => true,
                        },
                    });
                }
            },
        });
    };
    
    useEffect(() => {
        if (data && data.getClientById.status.success) {
            const client = data.getClientById.clients[0];
            setClientData({
                clientId: client.clientId,
                fullName: client.fullName,
                nationality: client.nationality,
                email: client.email,
                contact: client.contact,
                id: client.id,
            });
        }
    }, [data]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClientData({ ...clientData, [name]: value });
    };

    if (loading)
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        );
    if (error) return <p>Error fetching client data: {error.message}</p>;

    return (
        <>
            <Dialog open onOpenChange={onClose}>
                {/* <DialogTrigger asChild>
                    <Button className="flex bg-white hover:bg-gray-50">
                        <Pencil className="mr-2 text-black" />
                    </Button>
                </DialogTrigger> */}

                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Client</DialogTitle>
                    </DialogHeader>
                    <hr className="my-4 border-gray-300" />

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label htmlFor="clientId" className="text-sm font-medium">Client ID</label>
                            <input
                                type="text"
                                name="clientId"
                                id="clientId"
                                className="w-full h-10 border p-2 rounded-md"
                                value={clientData.clientId}
                                readOnly
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="fullName" className="text-sm font-medium">Client Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                className="w-full h-10 border p-2 rounded-md"
                                value={clientData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="nationality" className="text-sm font-medium">Nationality</label>
                            <input
                                type="text"
                                name="nationality"
                                id="nationality"
                                className="w-full h-10 border p-2 rounded-md"
                                value={clientData.nationality}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                className="w-full h-10 border p-2 rounded-md"
                                value={clientData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="contact" className="text-sm font-medium">Contact No</label>
                            <input
                                type="text"
                                name="contact"
                                id="contact"
                                className="w-full h-10 border p-2 rounded-md"
                                value={clientData.contact}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Action Buttons */}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                className="flex items-center px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                                type="submit"
                                disabled={mutationLoading}
                            >
                                {mutationLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog for Success/Error Messages */}
            {showAlert && (
                <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {alertType === 'success' ? 'Success' : 'Error'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {alertMessage}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setShowAlert(false)}>
                                OK
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
};

export default EditClient;