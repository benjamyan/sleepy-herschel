import { createAction, nanoid } from "@reduxjs/toolkit";

export const addItem = createAction("addItem", (itemGroupId) => ({
  payload: {
    itemGroupId,
    itemId: nanoid(5)
  }
}));
