import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Frame, Window, WindowContent, WindowHeader } from "react95";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

const prompt =
  "You are the popular streamer and content creator the primeagen, evaluate this answer given by an ai model and give a response that is most likely to be given by the primeagen, ONLY GIVE SHORT AND FUNNY RESPONSES, make sure to make fun of react typescript and all new modern web dev things, and make sure you include how good you are at vim, don't use any emojis in your answer, here is the answer given by ai model: ";

export default function PrimeagenOpinion({ content }: { content: string }) {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);

  const { refetch, isFetching } = useQuery({
    queryKey: ["primeagen-opinion", content],
    queryFn: async () => {
      let fullResponse = "";

      const resp = await puter.ai.chat(prompt + content, {
        model: "gpt-4o-mini",
        stream: true,
        testMode: true,
      });

      for await (const chunk of resp) {
        const text = chunk?.text || "";
        fullResponse += text;
        setResponse((prev) => prev + text);
        if (loading) setLoading(false);
      }

      return null;
    },
    enabled: false, // prevent automatic execution
  });

  const handleOpen = (openState: boolean) => {
    setOpen(openState);
    if (openState && !response) {
      refetch();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button className="mt-2">Get Primeagen's Opinion</Button>
      </SheetTrigger>
      <SheetContent>
        <Window className="h-full!">
          <SheetHeader>
            <WindowHeader>Primeagen’s Take</WindowHeader>
            {/* <SheetTitle>Primeagen’s Take</SheetTitle> */}
            {/* <SheetDescription> */}
            <WindowContent className="whitespace-pre-wrap! flex! flex-col gap-4">
              <div className="flex">
                <img src="/prime.png" alt="" className="size-40" />
                {loading && (
                  <Frame className="p-4 h-20" variant="field">
                    Wait let me think chat...
                  </Frame>
                )}
              </div>
              {!loading && (
                <Frame className="p-4" variant="field">
                  <div className="whitespace-pre-wrap">{response} </div>
                </Frame>
              )}
            </WindowContent>
            {/* </SheetDescription> */}
          </SheetHeader>
          {/* <WindowContent className="whitespace-pre-wrap!"> */}
          {/* {response} */}
          {/* </WindowContent> */}
        </Window>
      </SheetContent>
    </Sheet>
  );
}
