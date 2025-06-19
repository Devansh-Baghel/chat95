import axios from "axios";
import usePuter from "~/hooks/usePuter";

interface SaveNewChatParams {
  madeBy: string;
  question: string;
  answer: string;
  puter: any;
  chatId: string;
  model: string;
}

export async function saveNewChat({
  madeBy,
  question,
  answer,
  puter,
  chatId,
  model,
}: SaveNewChatParams) {
  try {
    // Step 1: Generate a title using the AI
    const titlePrompt = `Generate a short and relevant title for a conversation where the user asked: "${question}" and the assistant replied: "${answer}". Respond with just the title. do not add quotes around the title.`;

    const titleResponse = await puter.ai.chat(titlePrompt, {
      model,
      testMode: true,
    });

    const title = titleResponse?.message?.content?.trim() || "Untitled Chat";

    // Step 2: Send to backend
    const response = await axios.post("/api/chat", {
      madeBy,
      title,
      question,
      answer,
      uuid: chatId,
    });

    return response.data; // contains ApiResponse
  } catch (error: any) {
    console.error("Error saving chat:", error?.response?.data || error.message);
    throw error?.response?.data || error;
  }
}
