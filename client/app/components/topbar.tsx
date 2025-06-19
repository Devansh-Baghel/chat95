import { NavLink } from "react-router";
import { AppBar } from "react95";
import ChangeTheme from "./change-theme";
import logo from "@react95/icons/svg/Logo_32x32_4.svg";
import Settings from "./settings";

export default function TopBar() {
  return (
    <AppBar className="static! flex! flex-row! justify-between py-2! px-4">
      <NavLink
        to="/"
        className="flex items-center justify-center gap-2 text-2xl font-bold"
      >
        Chat95
        <img src={logo} className="size-10" />
      </NavLink>
      <div className="flex justify-center gap-4 items-center">
        <ChangeTheme />
        <Settings />
      </div>
    </AppBar>
  );
}
