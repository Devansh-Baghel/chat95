import { Select } from "react95";
import { useThemeStore } from "~/stores/themeStore";
import { allThemes, themeOptions } from "~/utils/themes";

export default function ChangeTheme() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div>
      <span className="mr-2">Theme</span>
      <Select
        defaultValue={theme.name}
        options={themeOptions}
        menuMaxHeight={300}
        width={200}
        onChange={(e) => setTheme(allThemes[e.value])}
      />
    </div>
  );
}
