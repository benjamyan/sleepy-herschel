import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import { addItem } from "./actions";

const itemGroupAdapter = createEntityAdapter();

export const CalculationTypes = {
  normal: "Normal",
  sortedAlphabetically: "Sorted (A-Z)",
  special: "Special"
};

const selectIdOfLargestItemGroup = (state) => {
  const itemGroups = Object.values(state.itemGroups.entities);
  let largestItemGroup = itemGroups[0];
  for (let i = 0; i < itemGroups.length; i++) {
    if (itemGroups[i].items.length > largestItemGroup.items.length) {
      largestItemGroup = itemGroups[i];
    }
  }
  return largestItemGroup.id;
};

// We derive some value based on the ItemGroup type and list of items contained in that ItemGroup.
// Let's pretend that the operations involved here are actually "expensive".
// FIXME: We want to avoid recomputing this when it is not necessary.
export const selectExpensiveDerivedValue = (state, { type, items }) => {
  console.log("Calculating derived value.");

  switch (type) {
    // Return items in a list format (order: as-is)
    case CalculationTypes.normal:
      return items.join(", ");

    // Return items in a list format (order: sorted alphabetically)
    case CalculationTypes.sortedAlphabetically:
      return [...items].sort((a, b) => a.localeCompare(b)).join(", ");

    // Describe the largest ItemGroup (i.e., the one containing the most items)
    // Ties are broken by whichever ItemGroup is listed first
    case CalculationTypes.special:
      return `The biggest ItemGroup is ${selectIdOfLargestItemGroup(state)}`;

    default:
      return "";
  }
};

const itemGroupSlice = createSlice({
  name: "itemGroups",
  initialState: itemGroupAdapter.getInitialState(),
  reducers: {
    addItemGroup: (state, action) => {
      itemGroupAdapter.addOne(state, {
        // If a payload is included (for example, when initializing the app), use as ID
        id: action.payload || nanoid(5),
        type: CalculationTypes.normal,
        items: []
      });
    },
    // Used to change the displayed derived value based on different calculation types
    setCalculationType: (state, action) => {
      const { id, type } = action.payload;
      state.entities[id].type = type;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addItem, (state, action) => {
      const { itemGroupId, itemId } = action.payload;
      const itemGroup = state.entities[itemGroupId];
      const { items } = itemGroup;
      itemGroup.items = [...items, itemId];
    });
  }
});

export const { addItemGroup, setCalculationType } = itemGroupSlice.actions;

export const {
  selectIds: selectItemGroupIds,
  selectById: selectItemGroupById
} = itemGroupAdapter.getSelectors((state) => state.itemGroups);

export default itemGroupSlice.reducer;
