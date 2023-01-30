import { createEntityAdapter, createSelector, createSlice, nanoid } from "@reduxjs/toolkit";
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

// We derive some value based on the ItemGroup type and list of items contained in that ItemGroup.
// Let's pretend that the operations involved here are actually "expensive".
// FIXME: We want to avoid recomputing this when it is not necessary.
export const selectExpensiveDerivedValue = (state, {type, items}) => {
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
/** 
 * Managing components that are calling a selector and using its store state. 
 * use `createSelector` to have a central point that can be called, 
 * avoiding continuous state updates from when multiple components are mounted/rendered
 * @see https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions 
 * */
 export const expensiveDerivedValueSelector = createSelector(
  [
    state=> state,
    (state, { type, items, id })=> (state, { type, items, id }),
  ],
  selectExpensiveDerivedValue,
  {
    memoizeOptions: {
      /** 
       * Bottleneck - adding more items than allocated to our cache will break memoization
       * Assigned dynamically based on group size to avoid overflow 
       * 
       * Refactor this to a factory
       * @see https://redux.js.org/usage/deriving-data-selectors#reselect-usage-patterns-and-limitations
       * */
      maxSize: itemGroupAdapter.getSelectors((state) => state.itemGroups).length - 1,
      /** Comparison function, OOB from redux wont work here */
      equalityCheck: (prevValue, nextValue) => {
        if (!nextValue.id || !prevValue.id) {
          /** Skip entries that arent the customized object passed in from above */
          return true
        } else if (nextValue.id === prevValue.id) {
          /** Comparison on values passing duplicate IDs */
          if (nextValue.type !== prevValue.type) {
            return false
          } else if (prevValue.items.length !== nextValue.items.length) {
            return false
          } else if (nextValue.items.some((val, i)=>prevValue.items[i] !== val)) {
            return false
          }
          return true
        }
        return false
      }
    }
  }
);