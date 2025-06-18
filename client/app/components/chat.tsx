// import { useSearchParams } from "react-router";
// import type { Route } from "./+types/chat";
// import usePuter from "~/hooks/usePuter";
// import { usePuterUser } from "~/hooks/usePuterUser";
// import { useContext, useEffect, useState } from "react";
// import { saveNewChat } from "~/utils/saveNewChat";
// import { useModelStore } from "~/stores/modelStore";
// import { Frame } from "react95";
// import OldChat from "./old-chat";
// import Markdown from "./markdown";

// export default function ChatPage({ params }: Route.ComponentProps) {
//   const [searchParams] = useSearchParams();
//   const newChatQuery = searchParams.get("query");

//   const { model } = useModelStore();
//   const puter = usePuter();
//   const { user } = usePuterUser();
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (newChatQuery) {
//         if (!puter) {
//           setResponse("Puter.js is still loading...");
//           return;
//         }

//         setResponse("");
//         setLoading(true);

//         let fullResponse = "";

//         try {
//           const stream = await puter.ai.chat(newChatQuery, {
//             stream: true,
//             model,
//             testMode: true,
//           });

//           for await (const chunk of stream) {
//             const text = chunk?.text || "";
//             fullResponse += text;
//             setResponse((prev) => prev + text);
//           }
//         } catch (err) {
//           console.error(err);
//           fullResponse = "❌ Error during streaming response.";
//           setResponse(fullResponse);
//         } finally {
//           setLoading(false);
//           console.log(user);
//           const savedChat = await saveNewChat({
//             madeBy: user.uuid,
//             chatId: params.chatId,
//             question: newChatQuery,
//             answer: fullResponse,
//             puter,
//             model,
//           });

//           console.log(savedChat);
//         }
//       }
//     };

//     fetchData();
//   }, [puter]);

//   if (newChatQuery) {
//     return (
//       <Frame variant="field" className="flex-1!">
//         <Markdown content={response} />
//       </Frame>
//     );
//   }

//   return <OldChat chatId={params.chatId} />;
// }
import type { Route } from "./+types/chat";
import UnifiedChat from "./unified-chat";

export default function ChatPage({ params }: Route.ComponentProps) {
  return <UnifiedChat chatId={params.chatId} />;
}
