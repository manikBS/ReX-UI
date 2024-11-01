import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  schemaId: String;
  schemaName: String;
  schemaSource: { type: String; uri: String };
  schemaTree: Object;
}[] = [];

const schemaDetailsSlice = createSlice({
  name: "schemaDatails",
  initialState,
  reducers: {
    addSchemaDetail: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const schemaDetails = (state: { schemaDetails: any }) => state.schemaDetails;

export const { addSchemaDetail } = schemaDetailsSlice.actions;

export default schemaDetailsSlice.reducer;
