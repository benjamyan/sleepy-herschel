import ReactDOM from "react-dom";
import { nanoid } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import store from "./store";
import { App } from "./App";
import { addItemGroup } from "./itemGroupSlice";
import { addItem } from "./actions";

// Pre-populate the app state with some ItemGroups and Items.
// This is simply a shortcut for clicking "Add ItemGroup" and "Add Item" manually.

// IDs to use for 2 ItemGroups
// We are keeping this ID generation outside the reducer logic so that we can
// pre-populate these specific ItemGroups with Items imperatively
const [id1, id2] = [nanoid(5), nanoid(5)];

// Add and populate first ItemGroup
store.dispatch(addItemGroup(id1));
store.dispatch(addItem(id1));
store.dispatch(addItem(id1));
store.dispatch(addItem(id1));

// Add and populate second ItemGroup
store.dispatch(addItemGroup(id2));
store.dispatch(addItem(id2));
store.dispatch(addItem(id2));
store.dispatch(addItem(id2));
store.dispatch(addItem(id2));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
