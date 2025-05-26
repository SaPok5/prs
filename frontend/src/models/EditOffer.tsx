import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditOfferModalProps {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (value: boolean) => void;
  offer: any;
  handleUpdateOffer: () => Promise<{ success: boolean; message: string }>;
  setEditOffer: (offer: any) => void;
}

const EditOfferModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  offer,
  handleUpdateOffer,
  setEditOffer,
}: EditOfferModalProps) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onUpdateOffer = async () => {
    const result = await handleUpdateOffer();
    setAlertMessage(result.message);
    setIsSuccess(result.success);
    setAlertVisible(true);
    
    if (result.success) {
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 1500); 
    }
  };
  

  return (
    <>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Offer</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="focus:outline-none"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="target" className="block text-sm font-medium text-gray-700">
                  Target
                </label>
                <input
                  id="target"
                  type="text"
                  placeholder="Target"
                  value={offer.target.toString()}
                  onChange={(e) =>
                    setEditOffer({ ...offer, target: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="bonus" className="block text-sm font-medium text-gray-700">
                  Bonus
                </label>
                <input
                  id="bonus"
                  type="number"
                  placeholder="Bonus"
                  value={offer.bonus}
                  onChange={(e) =>
                    setEditOffer({ ...offer, bonus: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="offer" className="block text-sm font-medium text-gray-700">
                  Offer
                </label>
                <input
                  id="offer"
                  type="number"
                  placeholder="Offer"
                  value={offer.offer}
                  onChange={(e) =>
                    setEditOffer({ ...offer, offer: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <input
                  id="remarks"
                  type="text"
                  placeholder="Remarks"
                  value={offer.remarks}
                  onChange={(e) =>
                    setEditOffer({ ...offer, remarks: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={onUpdateOffer}>Update</Button>
            </div>
          </div>
        </div>
      )}
   

      {/* Alert Dialog */}
      {alertVisible && (
        <AlertDialog open={alertVisible} onOpenChange={setAlertVisible}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isSuccess ? "Success" : "Error"}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAlertVisible(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default EditOfferModal;
