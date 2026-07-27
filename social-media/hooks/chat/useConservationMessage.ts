"use client";

import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import { socket } from "@/lib/socket";
import { getMessages } from "@/lib/api/chat.api";
import {
  sendMessage as emitSendMessage,
  joinConversation,
  leaveConversation,
  emitTyping,
  emitStopTyping,
} from "@/service/socket.service";

export interface ChatMessage {
  _id: string;
  conversation: string;
  sender: { _id: string; name: string; avatarUrl?: string } | string;
  text?: string;
  image?: { url: string; publicId?: string };
  createdAt: string;
}

export function useConversationMessages(
  conversationId: string | null,
  myUserId?: string,
) {
  const { data, isLoading, mutate } = useSWR(
    conversationId ? `conversation-messages-${conversationId}` : null,
    () => getMessages(conversationId as string),
  );

  // Pesan dari SWR (histori) digabung dengan pesan baru yang masuk via socket
  // const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);

  // Reset live messages tiap ganti percakapan
  // useEffect(() => {
  //   setLiveMessages([]);
  // }, [conversationId]);

  // Join/leave room percakapan + subscribe event
  useEffect(() => {
    if (!conversationId) return;

    joinConversation(conversationId);

    function handleNewMessage(message: ChatMessage) {
      if (message.conversation !== conversationId) return;
      // setLiveMessages((prev) => [...prev, message]);
      mutate((current = []) => [...current, message], false);
    }

    function handleUserTyping({ userId }: { userId: string }) {
      setTypingUserIds((prev) =>
        prev.includes(userId) ? prev : [...prev, userId],
      );
    }

    function handleUserStopTyping({ userId }: { userId: string }) {
      setTypingUserIds((prev) => prev.filter((id) => id !== userId));
    }

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      leaveConversation(conversationId);
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [conversationId]);

  const send = useCallback(
    (text: string) => {
      if (!conversationId || !myUserId || !text.trim()) return;
      emitSendMessage({
        conversationId,
        senderId: myUserId,
        text: text.trim(),
      });
    },
    [conversationId, myUserId],
  );

  const notifyTyping = useCallback(() => {
    if (!conversationId || !myUserId) return;
    emitTyping(conversationId, myUserId);
  }, [conversationId, myUserId]);

  const notifyStopTyping = useCallback(() => {
    if (!conversationId || !myUserId) return;
    emitStopTyping(conversationId, myUserId);
  }, [conversationId, myUserId]);

  // Histori (dari SWR, urutan terbaru->lama karena backend sort desc) di-reverse,
  // lalu disambung dengan pesan live yang masuk selama sesi ini
  const historyMessages: ChatMessage[] = [...(data ?? [])].reverse();
  // const messages = [...historyMessages, ...liveMessages];
  // const messages = [...historyMessages, ...liveMessages].filter(
  //   (msg, index, arr) => arr.findIndex((m) => m._id === msg._id) === index,
  // );
  // console.log(messages);
  const messages = historyMessages;

  const groupedMessages = [];

  for (const msg of messages) {
    const senderId =
      typeof msg.sender === "string" ? msg.sender : msg.sender._id;
    const sender = msg.sender;

    const lastGroup: any = groupedMessages[groupedMessages.length - 1];

    if (lastGroup && lastGroup.senderId === senderId) {
      lastGroup.messages.push(msg);
    } else {
      groupedMessages.push({
        senderId,
        sender,
        messages: [msg],
      });
    }
  }
  return {
    messages,
    groupedMessages,
    isLoading,
    typingUserIds,
    send,
    notifyTyping,
    notifyStopTyping,
    mutate,
  };
}
