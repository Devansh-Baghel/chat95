import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  SelectNative,
  TextInput,
  Tooltip,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";
import { v4 as uuidv4 } from "uuid";
import { useModelStore } from "~/stores/modelStore";
import { modelOptions } from "~/utils/models";

export default function QueryInput() {
  const [query, setQuery] = useState("");
  const { model, setModel } = useModelStore();
  const [uuid] = useState(uuidv4());
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query) return;

    navigate(`/chat/${uuid}?query=${query}`);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full">
      <Window
        className="flex! flex-col w-full!"
        // label="Enter a question"
      >
        <WindowHeader className="window-title">Ask Something..</WindowHeader>
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
              <Tooltip
                text="Send message"
                enterDelay={100}
                leaveDelay={500}
                position="left"
              >
                <Button type="submit">Ask</Button>
              </Tooltip>
            ) : (
              <Tooltip
                text="Enter text to send a message"
                enterDelay={100}
                leaveDelay={500}
                position="left"
              >
                <Button disabled variant="flat" className="cursor-not-allowed">
                  Ask
                </Button>
              </Tooltip>
            )}
          </div>
        </WindowContent>
      </Window>
    </form>
  );
}
