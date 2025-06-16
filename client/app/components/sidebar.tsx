import axios from "axios";
import { usePuterUser } from "~/hooks/usePuterUser";
import { useQuery } from "@tanstack/react-query";
import { Button, GroupBox, MenuList, MenuListItem } from "react95";
import { Link, NavLink } from "react-router";
import { ScrollArea } from "./ui/scroll-area";

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
      {/* <GroupBox label="New Chat" className="flex justify-center items-center"> */}
      <Link to="/" className="flex-1">
        <Button className="w-full! h-10!">New Chat</Button>
      </Link>
      {/* </GroupBox> */}
      <GroupBox label="Chats" className="w-80">
        <ScrollArea className="h-92">
          <MenuList className="hidden md:block">
            {/* <ScrollView> */}
            {chats.map((chat) => (
              <NavLink
                to={`/chat/${chat.uuid}`}
                key={chat.uuid}
                className="
                  group w-full justify-between items-center cursor-pointer!"
              >
                <MenuListItem className="flex justify-between items-center w-full">
                  <p className="truncate flex-1">
                    {chat.title.length > 30
                      ? `${chat.title.slice(0, 30)}...`
                      : chat.title}
                  </p>
                  <Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    X
                  </Button>
                </MenuListItem>
              </NavLink>
            ))}
            {/* </ScrollView> */}
          </MenuList>
        </ScrollArea>
      </GroupBox>
    </section>
  );
}
