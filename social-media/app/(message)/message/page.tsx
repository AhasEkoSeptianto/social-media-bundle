"use client";

import ConversationMessage from "@/components/shared/ConversationMessage";
import NavigationMenuMobile from "@/components/shared/NavigationMenuMobile";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/auths/useUser";
import { nextFetcher } from "@/lib/fetcher";
import { socket } from "@/lib/socket";
import { startConversation } from "@/lib/api/chat.api";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";
import dayjs from "@/lib/day";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const dummyDataListChat = [
  {
    picture: "/images/person1.avif",
    name: "Dian",
    last_msg: "omg lets to do thats",
    last_chat: "2m",
    total_unread_chat: 2,
  },
  {
    picture: "/images/person2.avif",
    name: "Rover",
    last_msg:
      "omg lets to do thats omg lets to do thats omg lets to do thats omg lets to do thats",
    last_chat: "2m",
    total_unread_chat: 0,
  },
  {
    picture: "/images/person3.avif",
    name: "Opang",
    last_msg: "omg lets to do thats",
    last_chat: "2m",
    total_unread_chat: 2,
  },
  {
    picture: "/images/person4.avif",
    name: "Sinta",
    last_msg: "omg lets to do thats",
    last_chat: "2m",
    total_unread_chat: 0,
  },
  {
    picture: "/images/person5.avif",
    name: "Oji",
    last_msg: "omg lets to do thats",
    last_chat: "2m",
    total_unread_chat: 0,
  },
];

export default function MessagePage() {
  const { user } = useUser();
  const { data } = useSWR("/api/chat/list-chat", nextFetcher);
  console.log(data);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [listOnlineFriendIds, setListOnlineFriendIds] = useState<string[]>([]);
  const router = useRouter();

  async function handleSelectFriend(friend: any) {
    setSelectedConversation(friend);
    try {
      const conversation = await startConversation(friend._id);
      setSelectedConversationId(conversation._id);
    } catch (err) {
      console.error("Gagal memulai percakapan:", err);
    }
  }

  useEffect(() => {
    if (user?.id) {
      socket.emit("get-friend-online", user.id);

      socket.on("list_friend_online", (usersIds) => {
        console.log(usersIds);
        setListOnlineFriendIds(usersIds);
      });

      return () => {
        socket.off("get-friend-online");
      };
    }
  }, [user]);

  return (
    <SidebarProvider className="">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div className="fixed bottom-0 left-0 z-30 lg:hidden">
        <NavigationMenuMobile />
      </div>

      {/* only phone devuce */}
      <main className="container p-4 lg:hidden">
        <Card className="min-h-[90vh] bg-brand">
          <CardHeader>
            <h1 className="text-xl">Message</h1>
          </CardHeader>
          <Separator className="h-4 w-full" />
          <CardContent className="gap-4 divide-y">
            {data?.data?.map((friend: any, idx: number) => (
              <div
                className="flex items-center space-x-4 p-2"
                key={idx}
                onClick={() => router.push(`/${friend?._id}/mobile`)}
              >
                <div className="relative">
                  <Avatar size="lg">
                    <AvatarImage src={friend?.avatarUrl} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {listOnlineFriendIds.includes(friend?._id) ? (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success z-50"></div>
                  ) : null}
                </div>
                <div>
                  <p className="text-lg">{friend?.username ?? friend?.name}</p>
                  <p className="text-white/70 truncate w-32">
                    {/* {dayjs(friend.createdAt).fromNow()} */}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      {/* only desktop */}
      <main className="w-full grid grid-cols-12 p-4 gap-8 hidden lg:block ">
        <div className="col-span-2"></div>
        <div className="col-span-9 container space-y-8">
          <div className="grid grid-cols-12 gap-5">
            <Card className="col-span-4 bg-brand h-[50rem]">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl">Message</h1>
                </div>
                <Field>
                  <ButtonGroup>
                    <Input
                      id="input-button-group"
                      placeholder="Type to search..."
                    />
                    <Button variant="outline">Search</Button>
                  </ButtonGroup>
                </Field>
              </CardHeader>
              <Separator className="mb-2 bg-white/10" />
              <CardContent className="overflow-auto scrollbar-thin">
                {data?.data?.map((friend: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between hover:bg-brand2 p-2 rounded-lg cursor-pointer"
                    onClick={() => handleSelectFriend(friend)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar size="lg">
                          <AvatarImage src={friend?.avatarUrl} alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {listOnlineFriendIds.includes(friend?._id) ? (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success z-50"></div>
                        ) : null}
                      </div>
                      <div>
                        <p className="text-lg">
                          {friend?.username ?? friend?.name}
                        </p>
                        <p className="text-white/70 truncate w-32">
                          {/* {dayjs(friend.createdAt).fromNow()} */}
                        </p>
                      </div>
                    </div>
                    <div>
                      {/* <p className="text-sm text-brand5">{chat.last_chat}</p>
                      <Badge className="bg-brand5 text-white font-bold">
                        {chat.total_unread_chat}
                      </Badge> */}
                    </div>
                  </div>
                ))}
                {/* {dummyDataListChat.map((chat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between hover:bg-brand2 p-2 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={chat.picture}
                        width={50}
                        height={50}
                        alt="prof"
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-lg">{chat.name}</p>
                        <p className="text-white/70 truncate w-32">
                          {chat.last_msg}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-brand5">{chat.last_chat}</p>
                      <Badge className="bg-brand5 text-white font-bold">
                        {chat.total_unread_chat}
                      </Badge>
                    </div>
                  </div>
                ))} */}
              </CardContent>
            </Card>
            <ConversationMessage
              conversationId={selectedConversationId}
              avatarUrl={selectedConversation?.avatarUrl}
              online_status={
                listOnlineFriendIds.includes(selectedConversation?._id)
                  ? "online"
                  : "offline"
              }
              username={
                selectedConversation?.username ?? selectedConversation?.name
              }
              key={selectedConversation?._id}
              participant_id={selectedConversation?._id}
            />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
