import { configureStore } from "@reduxjs/toolkit";
import schemaDetailsReducer from "./schemaDetailsSlice";
import placeholderDetailsReducer from "./placeholdersSlice";

export const store = configureStore({
  reducer: {
    schemaDetails: schemaDetailsReducer,
    placeholderDetails: placeholderDetailsReducer,
  },
});
