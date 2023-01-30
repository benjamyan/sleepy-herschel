import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalculationTypes,
  expensiveDerivedValueSelector,
  selectItemGroupById,
  setCalculationType
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
  const { type, items } = useSelector((state) => selectItemGroupById(state, id));

  // FIXME: This expensive value is derived every render, even when not necessary!
  const derivedValue = useSelector(
    /** Pass in the ID value here for comparison checks on the memozied selector */
    (state) => expensiveDerivedValueSelector(state, { type, items, id })
  );

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

      <div>Derived value: {derivedValue}</div>
      <div className="items">
        <h4>Items</h4>
        {renderedItems}
        <button onClick={() => dispatch(addItem(id))}>Add Item</button>
      </div>
    </div>
  );
};
