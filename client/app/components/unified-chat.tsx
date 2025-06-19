import {
  Button,
  Checkbox,
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
import { modelOptions } from "../utils/models";
import { useModelStore } from "../stores/modelStore";
import { useEffect, useRef, useState } from "react";
import { useSidebarStore } from "../stores/sidebarStore";
import usePuter from "../hooks/usePuter";
import { usePuterUser } from "../hooks/usePuterUser";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../root";
import { saveNewChat } from "../utils/saveNewChat";
import { useSearchParams } from "react-router";
import leftIcon from "@react95/icons/svg/ArrowLeft_32x32_4.svg";
import rightIcon from "@react95/icons/svg/ArrowRight_32x32_4.svg";
import LoadingSection from "~/components/loading-section";
import toast from "react-hot-toast";
import PrimeagenOpinion from "./prime";
import MarkdownWithCopy from "./new-markdown";

type Message = { role: string; content: string };
type ChatMessage = { question: string; answer: string };

function convertMessages(messages: ChatMessage[]): Message[] {
  return messages.flatMap(({ question, answer }) => [
    { role: "user", content: question },
    { role: "assistant", content: answer },
  ]);
}

export default function UnifiedChat({ chatId }: { chatId: string }) {
  const [searchParams] = useSearchParams();
  const newChatQuery = searchParams.get("query");

  const { model, setModel } = useModelStore();
  const { isOpen, setIsOpen } = useSidebarStore();
  const puter = usePuter();
  const { user } = usePuterUser();
  const [query, setQuery] = useState("");
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [streamingQuestion, setStreamingQuestion] = useState("");
  const [isNewChat, setIsNewChat] = useState(!!newChatQuery);
  const [hasProcessedNewQuery, setHasProcessedNewQuery] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generateImageMode, setGenerateImageMode] = useState(false);

  // Fetch existing chat data
  const {
    data: chat,
    isLoading,
    error,
  } = useQuery({
    queryKey: [chatId],
    queryFn: async () => {
      try {
        const { data } = await axios.post("/api/chat/get-chat", {
          uuid: chatId,
        });
        return data.data;
      } catch (err) {
        // If chat doesn't exist, return empty structure
        return { messages: [] };
      }
    },
    enabled: !isNewChat || hasProcessedNewQuery, // Don't fetch if it's a new chat that hasn't been processed yet
  });

  // Handle new chat query from search params
  useEffect(() => {
    const processNewChatQuery = async () => {
      if (newChatQuery && !hasProcessedNewQuery && puter) {
        setStreamingAnswer("");
        setStreamingQuestion(newChatQuery);

        let fullResponse = "";

        try {
          const stream = await puter.ai.chat(newChatQuery, {
            stream: true,
            model,
            testMode: true,
          });

          for await (const chunk of stream) {
            const text = chunk?.text || "";
            fullResponse += text;
            setStreamingAnswer((prev) => prev + text);
          }

          // Save the new chat
          const savedChat = await saveNewChat({
            madeBy: user.uuid,
            chatId: chatId,
            question: newChatQuery,
            answer: fullResponse,
            puter,
            model,
          });

          // Update the query cache with the new chat data
          queryClient.setQueryData([chatId], {
            messages: [{ question: newChatQuery, answer: fullResponse }],
          });

          queryClient.invalidateQueries(["sidebar-chats"]);

          setHasProcessedNewQuery(true);
          setIsNewChat(false);
          setStreamingAnswer("");
          setStreamingQuestion("");
        } catch (err) {
          console.error(err);
          setStreamingAnswer("❌ Error during streaming response.");
        }
      }
    };

    processNewChatQuery();
  }, [newChatQuery, puter, user, hasProcessedNewQuery, chatId, model]);

  // Send new message mutation
  const sendMessage = useMutation({
    mutationFn: async (newQuestion: string) => {
      if (!puter) throw new Error("Puter not ready");

      const currentMessages = chat?.messages || [];
      const messages = [
        ...convertMessages(currentMessages),
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
        messages: [...(old?.messages || []), newMessage],
      }));
      setQuery("");
      setStreamingAnswer("");
      setStreamingQuestion("");
    },
    onError: (err) => {
      console.error(err);
      setStreamingAnswer("❌ Error during response.");
      setStreamingAnswer("");
      setStreamingQuestion("");
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages, streamingAnswer]);

  if (isLoading && !isNewChat)
    return (
      <section className="flex-1 flex flex-col gap-4">
        <Frame
          variant="field"
          className="flex-1! flex! items-center justify-center"
        >
          <Button
            className="absolute! z-50 top-4 left-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            <img src={isOpen ? leftIcon : rightIcon} alt="" />
          </Button>

          <LoadingSection />
        </Frame>
      </section>
    );
  if (error && !isNewChat) return "Error loading chat";

  const allMessages = [
    ...(chat?.messages || []),
    ...(streamingQuestion
      ? [{ question: streamingQuestion, answer: streamingAnswer }]
      : []),
  ];

  const handleGenerateImage = async () => {
    if (!puter || !query.trim()) return;

    setGeneratedImage(null);
    setIsGeneratingImage(true);

    try {
      const img = await puter.ai.txt2img(query, true);
      setGeneratedImage(img.src);

      // Save the generated image as a message in DB
      const { data } = await axios.post("/api/chat/add-message", {
        uuid: chatId,
        question: query,
        answer: `![Generated Image](${img.src})`,
      });

      // Update the chat cache
      queryClient.setQueryData([chatId], (old: any) => ({
        ...old,
        messages: [...(old?.messages || []), data.data.messages.at(-1)],
      }));

      // Clear input
      setQuery("");
    } catch (err) {
      console.error("Image generation failed:", err);
      setGeneratedImage(null);
      toast.error(
        "You've hit your free-tier limit on Puter AI. Upgrade at https://puter.com"
      );
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <section className="flex-1 flex flex-col gap-4">
      <Frame variant="field" className="flex-1!">
        <Button
          className="absolute! z-50 top-4 left-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img src={isOpen ? leftIcon : rightIcon} alt="" />
        </Button>

        <ScrollArea className="h-[60vh] px-10 py-4 overflow-auto">
          {allMessages.length === 0 && !streamingQuestion ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Start a conversation...
            </div>
          ) : (
            allMessages.map((message, idx) => (
              <div key={idx} className="flex flex-col gap-2 mb-4">
                <Frame className="py-2 px-6 max-w-96! self-end">
                  {message.question}
                </Frame>
                <div className="px-10 py-6">
                  {message.answer.startsWith("![Generated Image](") ? (
                    <img
                      src={message.answer.match(/\((.*?)\)/)?.[1] || ""}
                      alt="Generated"
                      className="rounded-lg border shadow-md max-w-96 h-auto"
                    />
                  ) : (
                    <div>
                      <MarkdownWithCopy content={message.answer} />
                      {!(streamingQuestion === message.question) && (
                        <PrimeagenOpinion content={message.answer} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isGeneratingImage && (
            // <div className="text-center text-gray-500 py-4">
            //   🖼️ Generating image...
            // </div>
            <LoadingSection image />
          )}

          {generatedImage && (
            <div className="flex mx-10 my-4 max-w-96 h-auto">
              <img
                src={generatedImage}
                alt="Generated"
                className="rounded-lg border shadow-md max-w-full h-auto"
              />
            </div>
          )}

          <div ref={bottomRef} />
        </ScrollArea>
      </Frame>

      <form
        className="w-full"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!query.trim()) return;

          if (generateImageMode) {
            await handleGenerateImage(); // generate image instead of sending message
          } else if (!sendMessage.isPending) {
            sendMessage.mutate(query);
          }
        }}
      >
        <Window className="flex! flex-col w-full!">
          <WindowContent className="p-2! w-full!">
            <TextInput
              placeholder="Ask something..."
              fullWidth
              multiline
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={
                sendMessage.isPending || (isNewChat && !hasProcessedNewQuery)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent newline
                  const form = e.currentTarget.form;
                  if (form) {
                    form.requestSubmit(); // triggers onSubmit of the form
                  }
                }
              }}
              required
            />
            <div className="flex items-center justify-between w-full mt-2">
              {!generateImageMode ? (
                <SelectNative
                  options={modelOptions}
                  defaultValue={model}
                  onChange={(e) => setModel(e.value)}
                  disabled={
                    sendMessage.isPending ||
                    (isNewChat && !hasProcessedNewQuery)
                  }
                  aria-required
                />
              ) : (
                <div className="text-sm text-gray-700 px-2 py-1 italic">
                  Using DALL·E 3 (image generation)
                </div>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={generateImageMode}
                  variant="flat"
                  name="Generate-Image"
                  label={"Generate Image"}
                  value={"Generate-Image"}
                  onChange={(e) => setGenerateImageMode(e.target.checked)}
                />
                <Tooltip
                  text={
                    generateImageMode
                      ? "Generate an image using DALL·E 3"
                      : "Send message"
                  }
                  position="left"
                >
                  <Button
                    type="submit"
                    disabled={
                      (generateImageMode && isGeneratingImage) ||
                      (!generateImageMode && sendMessage.isPending) ||
                      (isNewChat && !hasProcessedNewQuery)
                    }
                  >
                    {generateImageMode
                      ? isGeneratingImage
                        ? "Generating..."
                        : "🎨 Generate"
                      : sendMessage.isPending
                      ? "Sending..."
                      : "Ask"}
                  </Button>
                </Tooltip>
              </div>
            </div>
          </WindowContent>
        </Window>
      </form>
    </section>
  );
}
