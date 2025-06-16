import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  Button,
  GroupBox,
  Select,
  SelectNative,
  TextInput,
  Tooltip,
} from "react95";
import { v4 as uuidv4 } from "uuid";
import { useModelStore, type Model } from "~/stores/modelStore";

type ModelOptionTypes = {
  value: Model;
  label: Model;
};

const modelOptions = [
  { value: "gpt-4o-mini", label: "gpt-4o-mini" },
  { value: "gpt-4o", label: "gpt-4o" },
  { value: "o1", label: "o1" },
  { value: "o1-mini", label: "o1-mini" },
  { value: "o1-pro", label: "o1-pro" },
  { value: "o3", label: "o3" },
  { value: "o3-mini", label: "o3-mini" },
  { value: "o4-mini", label: "o4-mini" },
  { value: "gpt-4.1", label: "gpt-4.1" },
  { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
  { value: "gpt-4.1-nano", label: "gpt-4.1-nano" },
  { value: "gpt-4.5-preview", label: "gpt-4.5-preview" },
  { value: "claude-sonnet-4", label: "claude-sonnet-4" },
  { value: "claude-opus-4", label: "claude-opus-4" },
  { value: "claude-3-7-sonnet", label: "claude-3-7-sonnet" },
  { value: "claude-3-5-sonnet", label: "claude-3-5-sonnet" },
  { value: "deepseek-chat", label: "deepseek-chat" },
  { value: "deepseek-reasoner", label: "deepseek-reasoner" },
  { value: "gemini-2.0-flash", label: "gemini-2.0-flash" },
  { value: "gemini-1.5-flash", label: "gemini-1.5-flash" },
  //   {
  //     value: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
  //     label: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
  //   },
  //   {
  //     value: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
  //     label: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
  //   },
  //   {
  //     value: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
  //     label: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
  //   },
  //   { value: "mistral-large-latest", label: "mistral-large-latest" },
  //   { value: "pixtral-large-latest", label: "pixtral-large-latest" },
  //   { value: "codestral-latest", label: "codestral-latest" },
  //   { value: "google/gemma-2-27b-it", label: "google/gemma-2-27b-it" },
  //   { value: "grok-beta", label: "grok-beta" },
] as ModelOptionTypes[];

export default function QueryInput() {
  const [query, setQuery] = useState("");
  const { model, setModel } = useModelStore();
  const [uuid, setUuid] = useState(uuidv4());
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query) return;

    navigate(`/chat/${uuid}?query=${query}`);
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="w-full">
      <GroupBox
        className="flex flex-col items-center gap-2"
        label="Enter a question"
      >
        <TextInput
          placeholder="Ask something..."
          fullWidth
          // multiline
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <div className="flex items-center justify-between w-full">
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
      </GroupBox>
    </form>
  );
}
