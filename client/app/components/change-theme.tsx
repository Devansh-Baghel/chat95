import { SelectNative, Tooltip } from "react95";
import { useAppViewStore } from "~/stores/sidebarStore";
import { useThemeStore } from "~/stores/themeStore";
import { allThemes, themeOptions } from "~/utils/themes";

export default function ChangeTheme() {
  const { theme, setTheme } = useThemeStore();
  const { showTopbar } = useAppViewStore();

  return (
    <div>
      <Tooltip
        text="Try Original or Blue theme."
        enterDelay={100}
        leaveDelay={500}
        position={showTopbar ? "left" : "right"}
      >
        <span className="mr-2">Theme</span>
      </Tooltip>
      <SelectNative
        defaultValue={theme.name}
        options={themeOptions}
        // menuMaxHeight={300}
        width={200}
        onChange={(e) => setTheme(allThemes[e.value])}
      />
    </div>
  );
}
