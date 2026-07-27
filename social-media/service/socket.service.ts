import { socket } from "@/lib/socket";

interface SendMessagePayload {
  conversationId: string;
  senderId: string;
  text?: string;
  image?: { url: string; publicId?: string };
}

export const sendMessage = (payload: SendMessagePayload) => {
  socket.emit("send_message", payload);
};

export const joinConversation = (conversationId: string) => {
  socket.emit("join_conversation", conversationId);
};

export const leaveConversation = (conversationId: string) => {
  socket.emit("leave_conversation", conversationId);
};

export const emitTyping = (conversationId: string, userId: string) => {
  socket.emit("typing", { conversationId, userId });
};

export const emitStopTyping = (conversationId: string, userId: string) => {
  socket.emit("stop_typing", { conversationId, userId });
};
