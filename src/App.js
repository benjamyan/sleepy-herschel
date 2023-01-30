import { useSelector } from "react-redux";
import { addItemGroup, selectItemGroupIds } from "./itemGroupSlice";
import { ItemGroup } from "./ItemGroup";
import { useDispatch } from "react-redux";

export const App = () => {
  const dispatch = useDispatch();
  const itemGroupIds = useSelector(selectItemGroupIds);
  const itemGroups = itemGroupIds.map((id) => <ItemGroup key={id} id={id} />);

  return (
    <div className="app">
      <button onClick={() => dispatch(addItemGroup())}>Add ItemGroup</button>
      {itemGroups}
    </div>
  );
};
