import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { addItem } from "./actions";

const itemAdapter = createEntityAdapter();

const itemSlice = createSlice({
  name: "items",
  initialState: itemAdapter.getInitialState(),
  extraReducers: (builder) => {
    builder.addCase(addItem, (state, action) => {
      const { itemId } = action.payload;
      itemAdapter.addOne(state, { id: itemId, content: `Item ${itemId}` });
    });
  }
});

export const { selectById: selectItemById } = itemAdapter.getSelectors(
  (state) => state.items
);

export default itemSlice.reducer;
