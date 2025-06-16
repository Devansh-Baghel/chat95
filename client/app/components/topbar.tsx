import { NavLink } from "react-router";
import {
  AppBar,
  Button,
  MenuList,
  MenuListItem,
  Separator,
  TextInput,
  Toolbar,
} from "react95";

export default function TopBar() {
  return (
    <AppBar className="static!">
      <NavLink to="/">Chat95</NavLink>
    </AppBar>
  );
}
