import React, { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  CalculationTypes,
  selectExpensiveDerivedValue,
  selectItemGroupById,
  setCalculationType,
  selectIdOfLargestItemGroup
} from "./itemGroupSlice";
import { addItem } from "./actions";
import { Item } from "./Item";

const SuperfluousInputElement = ()=> {
  const [text, setText] = useState("");

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  )
}

export const ItemGroup = ({ id }) => {
  const dispatch = useDispatch();


  /** 
   * Managing components that are calling a selector and using its store state. 
   * use `createSelector` to have a central point that can be called, 
   * avoiding continuous state updates from when multiple components are mounted/rendered
   * @see https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc-selectoroptions 
   * */
  const itemGroupSelector = createSelector(
    [
      (state)=> ({state, ...selectItemGroupById(state, id)})
    ],
    (itemGroupEntry)=> ({
      ...itemGroupEntry,
      externalMutation: selectIdOfLargestItemGroup(itemGroupEntry.state) === id
    }),
    {
      memoizeOptions: {
        maxSize: 2,
        equalityCheck: (prevValue, nextValue) => {
          if (prevValue.items.length !== nextValue.items.length) {
            return false
          }
          if (prevValue.type !== nextValue.type) {
            return false
          }
          if (selectIdOfLargestItemGroup(prevValue.state) !== selectIdOfLargestItemGroup(nextValue.state)) {
            return false
          }
          return true
        }
      }
    }
  );
  const { type, items, externalMutation, state } = useSelector(itemGroupSelector);

  const expensiveSelectorCall = createSelector(
    [
      ()=>({ state, type, externalMutation, items, id })
    ],
    ({state, type, items})=> (
      selectExpensiveDerivedValue(state, { type, items, id })
    ),
    {
      memoizeOptions: {
        equalityCheck: (prev, next)=> {
          if (prev.externalMutation !== next.externalMutation) {
            return false
          }
          return true
        }
      }
    }
  )
  const derivedValue = useSelector(expensiveSelectorCall);
  
  const renderedItems = items.map((id) => <Item key={id} id={id} />);
  
  const typeOptions = Object.values(CalculationTypes).map((type) => (
    <option key={type} value={type}>
      {type}
    </option>
  ));
  
  return (
    <div className="item-group">
      <h2>Item Group {id}</h2>
      <div>
        Calculation Type:
        <select
          value={type}
          onChange={(e) =>
            dispatch(setCalculationType({ id, type: e.target.value }))
          }
        >
          {typeOptions}
        </select>
      </div>

      <SuperfluousInputElement />
      
      { derivedValue }
      <div className="items">
        <h4>Items</h4>
        {renderedItems}
        <button onClick={() => dispatch(addItem(id))}>Add Item</button>
      </div>
    </div>
  );
};
