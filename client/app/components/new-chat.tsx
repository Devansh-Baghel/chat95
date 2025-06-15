import { useState } from "react";
import { Link } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function NewChat() {
  const [query, setQuery] = useState("");
  const [uuid, setUuid] = useState(uuidv4());
  // const puter = usePuter();
  // const { user } = usePuterUser();
  // const [response, setResponse] = useState("");
  // const [loading, setLoading] = useState(false);

  // const handleChat = async (e) => {
  //   e.preventDefault();

  //   if (!puter) {
  //     setResponse("Puter.js is still loading...");
  //     return;
  //   }

  //   setResponse("");
  //   setLoading(true);

  //   let fullResponse = "";

  //   try {
  //     const stream = await puter.ai.chat(query, {
  //       stream: true,
  //       model: "gpt-4o-mini",
  //     });

  //     for await (const chunk of stream) {
  //       const text = chunk?.text || "";
  //       fullResponse += text;
  //       setResponse((prev) => prev + text);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     fullResponse = "❌ Error during streaming response.";
  //     setResponse(fullResponse);
  //   } finally {
  //     setLoading(false);
  //     const savedChat = await saveNewChat({
  //       madeBy: user.uuid,
  //       question: query,
  //       answer: fullResponse, // <-- use the correct value
  //       puter,
  //     });

  //     console.log(savedChat);
  //   }
  // };

  return (
    <div>
      <h2>Puter.js Streamed Chat</h2>
      <input
        type="text"
        placeholder="Ask something..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Link to={`/chat/${uuid}?query=${query}`}>Chat</Link>
    </div>
  );
}
