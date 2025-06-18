import QueryInput from "~/components/query-input";
import type { Route } from "./+types/home";
import {
  Frame,
  GroupBox,
  MenuList,
  MenuListItem,
  Monitor,
  Separator,
} from "react95";
import { useNavigate } from "react-router";
import { useState } from "react";
// import Markdown from 'markdown-to-jsx'
import { v4 as uuidv4 } from "uuid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat95" },
    { name: "Chat95", content: "Welcome to Chat95!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [uuid] = useState(uuidv4());

  function handleClick(query: string) {
    navigate(`/chat/${uuid}?query=${query}`);
  }
  return (
    <main className="flex flex-col gap-2 w-full">
      {/* Welecome text / getting started / things to ask chat95 */}
      <Frame
        variant="field"
        className="flex-1! flex! justify-center items-center p-10"
      >
        {/* <Markdown></Markdown> */}
        <GroupBox
          label="Getting Started"
          variant="flat"
          className="size-full flex! items-center justify-center gap-10"
        >
          <Monitor />
          <MenuList>
            <MenuListItem
              className="w-96! cursor-pointer!"
              onClick={() => handleClick("Postgres > Tailwind CSS?")}
            >
              {"Postgres > Tailwind CSS?"}
            </MenuListItem>
            <Separator />
            <MenuListItem
              className="w-96! cursor-pointer!"
              onClick={() =>
                handleClick(
                  "Introduce me to Next.js in the style of The Primeagen"
                )
              }
            >
              {"Introduce me to Next.js in the style of The Primeagen"}
            </MenuListItem>
            <Separator />
            <MenuListItem
              className="w-96! cursor-pointer!"
              onClick={() => handleClick("Who is the real CEO of htmx?")}
            >
              {"Who is the real CEO of htmx?"}
            </MenuListItem>
          </MenuList>
        </GroupBox>
      </Frame>

      <QueryInput />
    </main>
  );
}
