import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalculationTypes,
  selectExpensiveDerivedValue,
  selectItemGroupById,
  setCalculationType
} from "./itemGroupSlice";
import { addItem } from "./actions";
import { Item } from "./Item";

export const ItemGroup = ({ id }) => {
  const dispatch = useDispatch();
  const itemGroup = useSelector((state) => selectItemGroupById(state, id));
  const { type, items } = itemGroup;
  const [text, setText] = useState("");

  // FIXME: This expensive value is derived every render, even when not necessary!
  const derivedValue = useSelector((state) =>
    selectExpensiveDerivedValue(state, { type, items })
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

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div>Derived value: {derivedValue}</div>
      <div className="items">
        <h4>Items</h4>
        {renderedItems}
        <button onClick={() => dispatch(addItem(id))}>Add Item</button>
      </div>
    </div>
  );
};
