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
import ChangeTheme from "./change-theme";

export default function TopBar() {
  return (
    <AppBar className="static! flex! flex-row! justify-between p-2!">
      <NavLink to="/">Chat95</NavLink>
      <ChangeTheme />
    </AppBar>
  );
}
