import type { Model } from "~/stores/modelStore";

export type ModelOptionTypes = {
  value: Model;
  label: Model;
};

export const modelOptions = [
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
