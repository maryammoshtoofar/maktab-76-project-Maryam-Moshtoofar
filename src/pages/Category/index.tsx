import { useParams } from "react-router-dom";
const Category: React.FC = () => {
  const { id } = useParams();
  return <div>{`Category ${id}`}</div>;
};

export default Category;
