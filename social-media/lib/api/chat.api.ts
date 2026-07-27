// lib/api/chat.api.ts
import { nextFetcher } from "../fetcher";

export async function startConversation(targetUserId: string) {
  const res = await nextFetcher(`/api/chat/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { targetUserId },
  });
  if (!res.success) throw new Error("Gagal memulai percakapan");
  return res.data;
}

export async function getMessages(conversationId: string, page = 1) {
  const res = await nextFetcher(
    `/api/chat/conversations/${conversationId}/messages?page=${page}`,
    { method: "GET" },
  );
  if (!res.success) throw new Error("Gagal mengambil pesan");
  return res.data;
}
