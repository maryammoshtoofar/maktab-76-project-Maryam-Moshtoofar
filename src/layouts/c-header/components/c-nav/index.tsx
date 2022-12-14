import { items } from "./items";
import { Menu } from "antd";
import { styles } from "./styles";

const Nav: React.FC = () => {
  return <Menu items={items} mode="horizontal" style={styles.menu} />;
};

export default Nav;
