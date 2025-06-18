import axios from "axios";
import { usePuterUser } from "~/hooks/usePuterUser";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, GroupBox, MenuList, MenuListItem } from "react95";
import { Link, NavLink, useNavigate } from "react-router";
import { ScrollArea } from "./ui/scroll-area";
import { useLocation } from "react-router";

export type ChatTypes = {
  uuid: string;
  title: string;
  _id: string;
};

export default function SideBar() {
  const { user } = usePuterUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch chats
  const {
    data: chats,
    isLoading,
    error,
    refetch,
  } = useQuery<ChatTypes[]>({
    queryKey: ["sidebar-chats"],
    queryFn: async () => {
      const { data } = await axios.post("/api/chat/get-titles", {
        madeBy: user.uuid,
      });
      return data.data;
    },
  });

  // Mutation for deleting a chat
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => axios.post("/api/chat/delete-chat", { uuid }),
    onSuccess: (_, deletedUuid) => {
      refetch();

      if (location.pathname === `/chat/${deletedUuid}`) {
        navigate("/");
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!chats || error) return <div>Error</div>;

  return (
    <section className="w-80 h-full flex flex-col gap-4">
      <Link to="/" className="flex-1">
        <Button className="w-full! h-10!">New Chat</Button>
      </Link>

      {chats.length === 0 ? (
        <GroupBox label="Chats" className="w-80 h-92">
          No Chats
        </GroupBox>
      ) : (
        <GroupBox label="Chats" className="w-80">
          <ScrollArea className="h-92">
            <MenuList className="hidden md:block w-full!">
              {chats.map((chat) => (
                <NavLink
                  to={`/chat/${chat.uuid}`}
                  key={chat.uuid}
                  className="group w-full justify-between items-center cursor-pointer!"
                >
                  <MenuListItem className="flex justify-between items-center w-full! cursor-pointer!">
                    <p className="truncate flex-1">
                      {chat.title.length > 30
                        ? `${chat.title.slice(0, 30)}...`
                        : chat.title}
                    </p>
                    <Button
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.preventDefault(); // prevent nav on delete
                        deleteMutation.mutate(chat.uuid);
                      }}
                    >
                      X
                    </Button>
                  </MenuListItem>
                </NavLink>
              ))}
            </MenuList>
          </ScrollArea>
        </GroupBox>
      )}

      <p className="text-lg  text-center mt-10">
        made by{" "}
        <a
          href="https://baghel.dev"
          target="_blank"
          className="underline text-blue-800"
        >
          baghel.dev
        </a>
      </p>
    </section>
  );
}
