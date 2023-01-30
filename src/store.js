import { configureStore } from "@reduxjs/toolkit";
import itemGroupReducer from "./itemGroupSlice";
import itemReducer from "./itemSlice";

export default configureStore({
  reducer: {
    itemGroups: itemGroupReducer,
    items: itemReducer
  }
});
