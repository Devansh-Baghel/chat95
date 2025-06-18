import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Model =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "o1"
  | "o1-mini"
  | "o1-pro"
  | "o3"
  | "o3-mini"
  | "o4-mini"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4.5-preview"
  | "claude-sonnet-4"
  | "claude-opus-4"
  | "claude-3-7-sonnet"
  | "claude-3-5-sonnet"
  | "deepseek-chat"
  | "deepseek-reasoner"
  | "gemini-2.0-flash"
  | "gemini-1.5-flash"
  | "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"
  | "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
  | "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo"
  | "mistral-large-latest"
  | "pixtral-large-latest"
  | "codestral-latest"
  | "google/gemma-2-27b-it"
  | "grok-beta";

interface ModelStore {
  model: Model;
  setModel: (model: Model) => void;
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      model: "gpt-4o-mini",
      setModel: (model) => set({ model }),
    }),
    { name: "model-store" }
  )
);
