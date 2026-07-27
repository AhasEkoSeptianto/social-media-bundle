import {
  ArrowLeft,
  Images,
  Phone,
  Send,
  Video,
  Ellipsis,
  CheckCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "../ui/message-scroller";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "../ui/message";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bubble, BubbleContent, BubbleGroup } from "../ui/bubble";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useUser } from "@/hooks/auths/useUser";
import { useConversationMessages } from "@/hooks/chat/useConservationMessage";
import dayjs from "@/lib/day";

interface friendConversation {
  conversationId: string | null;
  avatarUrl: string;
  username: string;
  participant_id: string;
  online_status: string;
  with_back_button?: boolean;
}

export default function ConversationMessage(props: friendConversation) {
  const router = useRouter();
  const { user } = useUser();
  const [input, setInput] = useState("");

  const {
    messages,
    groupedMessages,
    isLoading,
    typingUserIds,
    send,
    notifyTyping,
    notifyStopTyping,
  } = useConversationMessages(props.conversationId, user?.id);

  function handleSend() {
    if (!input.trim()) return;
    send(input);
    setInput("");
    notifyStopTyping();
  }

  function handleChange(value: string) {
    setInput(value);
    if (value.trim()) {
      notifyTyping();
    } else {
      notifyStopTyping();
    }
  }

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="last-anchor">
      <div className="relative flex flex-col gap-4 w-full col-span-8 ">
        <Card className="col-span-8 bg-brand">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {props.with_back_button ? (
                <ArrowLeft onClick={() => router.back()} />
              ) : null}
              <Avatar size="lg">
                <AvatarImage src={props?.avatarUrl} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg">{props.username}</p>
                <p className="text-white/70 truncate max-w-60 opacity-70">
                  {typingUserIds.length > 0
                    ? "sedang mengetik..."
                    : props.online_status}
                </p>
              </div>
            </div>
            <div className="opacity-70 flex items-center space-x-4">
              <Button size="icon" variant="outline" className="cursor-pointer">
                <Phone size={20} />
              </Button>
              <Button size="icon" variant="outline" className="cursor-pointer">
                <Video size={20} />
              </Button>
              <Button size="icon" variant="outline" className="cursor-pointer">
                <Ellipsis size={20} />
              </Button>
            </div>
          </CardHeader>
          <Separator className="mb-2 bg-white/10" />
          <CardContent className="overflow-hidden h-[70vh] lg:h-[39rem] ">
            {!props.conversationId ? (
              <div className="h-full flex items-center justify-center text-white/50">
                Pilih percakapan untuk mulai chat
              </div>
            ) : isLoading ? (
              <div className="h-full flex items-center justify-center text-white/50">
                Memuat pesan...
              </div>
            ) : (
              <MessageScroller className="flex-1">
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={false}
                    className="p-(--card-spacing)"
                  >
                    {groupedMessages?.map((groupMessage: any, idx_grouped) => {
                      const isMe = groupMessage.senderId === user?.id;
                      const isLastGroup =
                        idx_grouped === groupedMessages.length - 1;
                      const lastMessageInGroup =
                        groupMessage.messages[groupMessage.messages.length - 1];

                      return (
                        <MessageScrollerItem
                          key={idx_grouped}
                          messageId={lastMessageInGroup._id}
                          scrollAnchor={isLastGroup}
                        >
                          <Message align={isMe ? "end" : "start"}>
                            {/* <MessageAvatar>
                            <Avatar>
                              <AvatarImage
                                src={groupMessage.sender?.avatarUrl}
                                alt="@avatar"
                              />
                              <AvatarFallback>R</AvatarFallback>
                            </Avatar>
                          </MessageAvatar> */}
                            <MessageContent>
                              <BubbleGroup>
                                {groupMessage?.messages?.map(
                                  (msg: any, idx: number) => {
                                    const time_send = dayjs(msg.createdAt);
                                    const before_this_time_send = dayjs(
                                      groupMessage?.messages[
                                        idx === 0 ? 0 : idx - 1
                                      ].createdAt,
                                    );
                                    const isInMinuteRange = Math.abs(
                                      time_send.diff(before_this_time_send),
                                    );
                                    return (
                                      <Bubble key={idx} className="">
                                        <BubbleContent
                                          className={`${isMe ? "!bg-brand5" : "!bg-brand4"} !text-white !text-md max-w-96`}
                                        >
                                          <p>{msg.text}</p>
                                        </BubbleContent>
                                        {groupMessage?.messages.length ===
                                          idx + 1 ||
                                        (!isInMinuteRange && idx !== 0) ? (
                                          <MessageFooter>
                                            <div
                                              className={`flex items-center space-x-1 ${isMe ? "justify-end" : "justify-start"}`}
                                            >
                                              <p
                                                className={`text-white/40 mt-1 ${isMe ? "text-right" : ""}`}
                                              >
                                                {dayjs(msg.createdAt).format(
                                                  "HH:mm",
                                                )}
                                              </p>
                                              {isMe ? (
                                                <CheckCheck
                                                  size={13}
                                                  className={
                                                    msg.readBy?.includes(
                                                      props.participant_id,
                                                    )
                                                      ? "text-blue-400"
                                                      : ""
                                                  }
                                                />
                                              ) : null}
                                            </div>
                                          </MessageFooter>
                                        ) : null}
                                      </Bubble>
                                    );
                                  },
                                )}
                              </BubbleGroup>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      );
                    })}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
              </MessageScroller>
            )}
          </CardContent>
          <CardFooter className="bg-brand flex items-start space-x-4">
            <Button variant="outline">
              <Images />
            </Button>
            <Input
              placeholder="message"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={!props.conversationId}
            />
            <Button
              variant="outline"
              onClick={handleSend}
              disabled={!props.conversationId}
            >
              <Send />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MessageScrollerProvider>
  );
}
