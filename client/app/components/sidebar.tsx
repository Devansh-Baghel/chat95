import axios from "axios";
import { usePuterUser } from "~/hooks/usePuterUser";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Frame,
  GroupBox,
  MenuList,
  MenuListItem,
  ScrollView,
  Separator,
} from "react95";
import { useState } from "react";
import { Link } from "react-router";

export type ChatTypes = {
  uuid: string;
  title: string;
  _id: string;
};

export default function SideBar() {
  const { user } = usePuterUser();
  const {
    data: chats,
    isLoading,
    error,
  } = useQuery<ChatTypes[]>({
    queryKey: ["sidebar-chats"],
    queryFn: async () => {
      const { data } = await axios.post("/api/chat/get-titles", {
        madeBy: user.uuid,
      });
      return data.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!chats || error) return <div>Error</div>;

  return (
    <section className="w-80 h-full flex flex-col gap-4">
      <GroupBox label="New Chat" className="flex justify-center items-center">
        <Link to="/" className="flex-1">
          <Button className="w-full! h-10!">New Chat</Button>
        </Link>
      </GroupBox>
      <GroupBox label="Sidebar" className="w-80">
        <div className="h-full">
          <MenuList className="hidden md:block">
            {/* <ScrollView> */}
            {chats.map((chat) => (
              <MenuListItem
                key={chat.uuid}
                className="group flex justify-between items-center"
              >
                <p className="truncate">
                  {chat.title.length > 25
                    ? `${chat.title.slice(0, 25)}...`
                    : chat.title}
                </p>
                <Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Delete
                </Button>
              </MenuListItem>
            ))}
            {/* </ScrollView> */}
          </MenuList>
        </div>
      </GroupBox>
    </section>
  );
}
