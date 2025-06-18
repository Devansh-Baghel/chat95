import {
  Frame,
  Window,
  WindowHeader,
  WindowContent,
  Button,
  GroupBox,
} from "react95";
import { usePuterUser } from "~/hooks/usePuterUser";

export default function WelcomePage() {
  const { signInWithPuter } = usePuterUser();

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-teal-500">
      <Frame
        variant="window"
        className="w-[600px] max-w-[90%] p-4 flex flex-col items-center gap-6"
      >
        <Window className="w-full">
          <WindowHeader className="flex justify-between px-2">
            <span>Chat95.exe</span>
          </WindowHeader>
          <WindowContent className="text-center flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">👋 Welcome to Chat95!</h1>
            <p className="text-lg">
              Your retro AI chat companion powered by Puter.
            </p>
            <GroupBox label="Get Started" className="p-4 w-full text-center">
              <Button size="lg" onClick={signInWithPuter}>
                🚀 Authorize with Puter
              </Button>
            </GroupBox>
          </WindowContent>
        </Window>
      </Frame>
    </main>
  );
}
