// provides type safety/inference
import { useSearchParams } from "react-router";
import type { Route } from "./+types/chat";
import usePuter from "~/hooks/usePuter";
import { usePuterUser } from "~/hooks/usePuterUser";
import { useEffect, useState } from "react";
import { saveNewChat } from "~/utils/saveNewChat";

// // provides `loaderData` to the component
// export async function loader({ params }: Route.LoaderArgs) {}

// export async function clientLoader({ params }: Route.ClientLoaderArgs) {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("query");
// }

export default function ChatPage({ params }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const newChatQuery = searchParams.get("query");

  const puter = usePuter();
  const { user } = usePuterUser();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  //   if query is there make a request to llm as soon as the component loads
  //   else show the previous chat history

  useEffect(() => {
    const fetchData = async () => {
      if (newChatQuery) {
        if (!puter) {
          setResponse("Puter.js is still loading...");
          return;
        }

        setResponse("");
        setLoading(true);

        let fullResponse = "";

        try {
          const stream = await puter.ai.chat(newChatQuery, {
            stream: true,
            model: "gpt-4o-mini",
          });

          for await (const chunk of stream) {
            const text = chunk?.text || "";
            fullResponse += text;
            setResponse((prev) => prev + text);
          }
        } catch (err) {
          console.error(err);
          fullResponse = "❌ Error during streaming response.";
          setResponse(fullResponse);
        } finally {
          setLoading(false);
          console.log(user);
          const savedChat = await saveNewChat({
            madeBy: user.uuid,
            chatId: params.chatId,
            question: newChatQuery,
            answer: fullResponse,
            puter,
          });

          console.log(savedChat);
        }
      }
    };

    fetchData();
  }, [puter]);

  if (newChatQuery) {
    return (
      <div>
        <p>Question: {newChatQuery}</p>

        <p>Answer: {response}</p>
      </div>
    );
  }

  return <div>Chat id: {params.chatId}</div>;
}
