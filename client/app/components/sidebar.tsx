import axios from "axios";
import { usePuterUser } from "~/hooks/usePuterUser";
import { useQuery } from "@tanstack/react-query";
import { MenuList, MenuListItem, Separator } from "react95";

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
    <MenuList>
      {chats.map((chat) => (
        <MenuListItem key={chat.uuid}>{chat.title}</MenuListItem>
      ))}

      <Separator />
      <MenuListItem disabled>😴 Sleep</MenuListItem>
    </MenuList>
  );
}
