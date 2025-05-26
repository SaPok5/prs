import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define MonthData type
export interface MonthData {
  month: number;
  year: number;
  label?: string;
}

// Define the structure for OfferData
export interface OfferData {
  target: string;
  bonus: string;
  offer: string;
  selectedMonthData: MonthData;
  remarks: string;
}

const initialState: OfferData = {
  target: "",
  bonus: "",
  offer: "",
  selectedMonthData: { month: 0, year: 0 }, 
  remarks: "",
};

// Create the offer slice
const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    setOffer(state, action: PayloadAction<OfferData>) {
      state.target = action.payload.target;
      state.bonus = action.payload.bonus;
      state.offer = action.payload.offer;
      state.selectedMonthData = action.payload.selectedMonthData;
      state.remarks = action.payload.remarks;
    },
    updateOfferField(
      state,
      action: PayloadAction<{ field: keyof OfferData; value: string | MonthData }>
    ) {
      const { field, value } = action.payload;

      // Check if the field is selectedMonthData and ensure value is a valid MonthData object
      if (field === "selectedMonthData" && typeof value === "object" && value !== null) {
        state.selectedMonthData = value as MonthData;
      } else if (field !== "selectedMonthData") {
        // For other fields, handle as string (target, bonus, offer, remarks)
        state[field] = value as string;
      }
    },
    clearOffer(_state) {
      return initialState; 
    },
  },
});

export const { setOffer, updateOfferField, clearOffer } = offerSlice.actions;
export default offerSlice.reducer;
