import QueryInput from "~/components/query-input";
import type { Route } from "./+types/home";
import { Frame } from "react95";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat95" },
    { name: "Chat95", content: "Welcome to Chat95!" },
  ];
}

export default function Home() {
  return (
    <main className="flex flex-col gap-2 w-full">
      {/* Welecome text / getting started / things to ask chat95 */}
      <Frame variant="field" className="flex-1!"></Frame>

      <QueryInput />
    </main>
  );
}
