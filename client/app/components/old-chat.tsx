import {
  Button,
  Frame,
  SelectNative,
  TextInput,
  Tooltip,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import axios from "axios";
import MarkdownEditor from "./markdown";
import { ScrollArea } from "./ui/scroll-area";
import { modelOptions } from "~/utils/models";
import { useModelStore } from "~/stores/modelStore";
import { useEffect, useRef, useState } from "react";
import { useSidebarStore } from "~/stores/sidebarStore";
import usePuter from "~/hooks/usePuter";
import { usePuterUser } from "~/hooks/usePuterUser";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "~/root";
import leftIcon from "@react95/icons/svg/ArrowLeft_32x32_4.svg";
import rightIcon from "@react95/icons/svg/ArrowRight_32x32_4.svg";

type Message = { role: string; content: string };
type ChatMessage = { question: string; answer: string };

function convertMessages(messages: ChatMessage[]): Message[] {
  return messages.flatMap(({ question, answer }) => [
    { role: "user", content: question },
    { role: "assistant", content: answer },
  ]);
}

export default function OldChat({ chatId }: { chatId: string }) {
  const { model, setModel } = useModelStore();
  const { isOpen, setIsOpen } = useSidebarStore();
  const puter = usePuter();
  const { user } = usePuterUser();
  const [query, setQuery] = useState("");
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [streamingQuestion, setStreamingQuestion] = useState("");
  // const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    data: chat,
    isLoading,
    error,
  } = useQuery({
    queryKey: [chatId],
    queryFn: async () => {
      const { data } = await axios.post("/api/chat/get-chat", { uuid: chatId });
      return data.data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (newQuestion: string) => {
      if (!puter) throw new Error("Puter not ready");

      const messages = [
        ...convertMessages(chat.messages),
        { role: "user", content: newQuestion },
      ];

      const stream = await puter.ai.chat(messages, {
        stream: true,
        model,
        testMode: true,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const text = chunk?.text || "";
        fullResponse += text;
        setStreamingAnswer((prev) => prev + text);
      }

      // Save to MongoDB via the backend
      const { data } = await axios.post("/api/chat/add-message", {
        uuid: chatId,
        question: newQuestion,
        answer: fullResponse,
      });

      return data.data.messages.at(-1); // return the new message only
    },
    onMutate: (newQuestion: string) => {
      setStreamingAnswer("");
      setStreamingQuestion(newQuestion);
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData([chatId], (old: any) => ({
        ...old,
        messages: [...old.messages, newMessage],
      }));
      setQuery("");
      setStreamingAnswer("");
      setStreamingQuestion("");
    },
    onError: (err) => {
      console.error(err);
      setStreamingAnswer("❌ Error during response.");
    },
  });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages, streamingAnswer]);

  if (isLoading) return "Loading...";
  if (error) return "Error";

  return (
    <section className="flex-1 flex flex-col gap-4">
      <Frame variant="field" className="flex-1!">
        <Button
          className="absolute! z-50 top-4 left-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Open/Close */}
          <img src={isOpen ? leftIcon : rightIcon} alt="" />
        </Button>
        <ScrollArea className="h-[60vh] px-10 py-4 overflow-auto">
          {[
            ...chat.messages,
            ...(streamingQuestion
              ? [{ question: streamingQuestion, answer: streamingAnswer }]
              : []),
          ].map((message, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <Frame className="py-2 px-6 max-w-96! self-end">
                {message.question}
              </Frame>
              <div className="px-10 py-6">
                <MarkdownEditor content={message.answer} />
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </ScrollArea>
      </Frame>

      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) sendMessage.mutate(query);
        }}
      >
        <Window className="flex! flex-col w-full!">
          {/* <WindowHeader className="window-title">Ask Something..</WindowHeader> */}
          <WindowContent className="p-2! w-full!">
            <TextInput
              placeholder="Ask something..."
              fullWidth
              multiline
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <div className="flex items-center justify-between w-full mt-2">
              <SelectNative
                options={modelOptions}
                defaultValue={model}
                onChange={(e) => setModel(e.value)}
                aria-required
              />
              {query ? (
                <Tooltip text="Send message" position="left">
                  <Button type="submit" disabled={sendMessage.isPending}>
                    Ask
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip text="Enter text to send a message" position="left">
                  <Button
                    disabled
                    variant="flat"
                    className="cursor-not-allowed"
                  >
                    Ask
                  </Button>
                </Tooltip>
              )}
            </div>
          </WindowContent>
        </Window>
      </form>
    </section>
  );
}
