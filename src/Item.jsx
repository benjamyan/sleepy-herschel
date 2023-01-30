import { useSelector } from "react-redux";
import { selectItemById } from "./itemSlice";

export const Item = ({ id }) => {
  const item = useSelector((state) => selectItemById(state, id));
  const { content } = item;

  return <div className="item">{content}</div>;
};
