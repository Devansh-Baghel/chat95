import {
  Button,
  GroupBox,
  Radio,
  Tab,
  TabBody,
  Tabs,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import SettingsIcon from "@react95/icons/svg/Settings_32x32_4.svg";
import { useState } from "react";
import { useAppViewStore } from "~/stores/sidebarStore";

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const { showTopbar, setShowTopbar } = useAppViewStore();

  const handleChange = (
    value: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActiveTab(value);
  };

  const handleTopbarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "show";
    setShowTopbar(value);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <img src={SettingsIcon} alt="" className="size-8!" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <Window className="w-full! h-full!">
          <WindowHeader>store.exe</WindowHeader>
          <WindowContent>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab value={0}>General</Tab>
              <Tab value={1}>Chat</Tab>
            </Tabs>
            <TabBody style={{ height: 300 }}>
              {activeTab === 0 && (
                <div>
                  <GroupBox label="UI Style">
                    <Radio
                      checked={showTopbar === true}
                      onChange={handleTopbarChange}
                      value="show"
                      label="Show Topbar"
                      name="topbar"
                    />
                    <br />
                    <Radio
                      checked={showTopbar === false}
                      onChange={handleTopbarChange}
                      value="hide"
                      label="Hide Topbar"
                      name="topbar"
                    />
                  </GroupBox>
                </div>
              )}
              {activeTab === 1 && (
                <div>
                  <div>Chat stuff here</div>
                </div>
              )}
            </TabBody>
          </WindowContent>
        </Window>
      </DialogContent>
    </Dialog>
  );
}
