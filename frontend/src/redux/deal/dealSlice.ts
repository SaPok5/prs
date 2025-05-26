import { Deal } from "@/types/deal.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DealType = {
  dealsList: Deal[];
};

interface IDealState {
  deal: DealType;
}

const initialState: DealType = {
  dealsList: [],
};

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    setDeals: (state, action: PayloadAction<Deal[]>) => {
      state.dealsList = action.payload;
    },
    addDeal: (state, action: PayloadAction<Deal>) => {
      console.log("added to sice");
      state.dealsList.unshift(action.payload);
    },
    removeDeal: (state, action: PayloadAction<number | string>) => {
      state.dealsList = state.dealsList.filter(
        (item) => item.id !== action.payload
      );
    },
    addDealPayment: (
      state,
      action
    ) => {
      const deal = state.dealsList.find(
        (item) => item.id === action.payload.dealId
      );
      if (deal) {
        if (!deal.payments) {
          deal.payments = [];
        }
        deal.payments.push(action.payload.payment);
      }
    },
    updateDeal: (state, action) => {
      const index = state.dealsList.findIndex(
        (deal) => deal.id === action.payload.id
      );
      if (index !== -1) {
        // If the deal is found, update its properties excluding payments
        const { payments, ...updatedDeal } = action.payload; // Exclude payments from the update
        console.log(updatedDeal, "Updated deal");

        // Update the deal in the state while keeping payments intact
        state.dealsList[index] = {
          ...state.dealsList[index], // Keep the existing deal data
          ...updatedDeal, // Overwrite with the new deal data (excluding payments)
        };
      }
    },
  },
});

export const { setDeals, addDeal, removeDeal, updateDeal, addDealPayment } =
  dealSlice.actions;
export default dealSlice.reducer;
export const selectDealsList = (state: IDealState) => state.deal.dealsList;
