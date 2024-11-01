import { createSlice } from "@reduxjs/toolkit";

export type PlaceholderType = {
  placeholderName: String;
  jsonPath: String;
  dataType: String;
  placeholderType: String;
  format: String;
  toType: String;
};

type PlaceholderStateTypes = {
  currentSelection: PlaceholderType;
  placeholders: PlaceholderType[];
};
const initialState: PlaceholderStateTypes = {
  currentSelection: null,
  placeholders: [],
};

const placeholderDetailsSlice = createSlice({
  name: "placeholderDetails",
  initialState,
  reducers: {
    setCurrentSelectionField: (state, action) => {
      state.currentSelection = { ...state.currentSelection, ...action.payload };
    },
    setCurrentSelection: (state, action) => {
      state.currentSelection = action.payload;
    },
    addPlaceholder: (state, action) => {
      state.placeholders.push(action.payload);
    },
    addAllPlaceholders: (state, action) => {
      state.placeholders = action.payload;
    },
  },
});

export const currentPlaceholderSelection = (state) => state.placeholderDetails.currentSelection;

export const allPlaceholders = (state) => state.placeholderDetails.placeholders;

export const { setCurrentSelection, setCurrentSelectionField, addPlaceholder, addAllPlaceholders } =
  placeholderDetailsSlice.actions;

export default placeholderDetailsSlice.reducer;
