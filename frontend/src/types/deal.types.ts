export type DealPayment = {
  id: string;
  paymentDate: string;
  paymentStatus: string; 
  receiptImage: string;
  receivedAmount: string;
  remarks: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
  verifierId: string | null;
  verifier: Verifier | null;
};

type Verifier ={
  fullName: string;
}

type User = {
  id: string;
  fullName: string;
};

type Client = {
  fullName: string;
};

export type Deal = {
  id: string;
  dealId: string | null;
  dealName: string;
  clientId: string;
  sourceType: string | null;
  workType: string | null;
  dealValue: number | null;
  dealDate: string;
  dueDate: string;
  remarks: string | null;
  isEdited: boolean | null;
  createdAt: string | null;
  updatedAt: string |null ;
  payments?: DealPayment[] | null;
  client: Client;
  user: User;
  duesAmount?: string
};
