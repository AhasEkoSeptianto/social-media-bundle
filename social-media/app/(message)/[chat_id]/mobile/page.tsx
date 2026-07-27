"use client";
import NavigationMenuMobile from "@/components/shared/NavigationMenuMobile";
import { nextFetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";
import ConversationMessage from "@/components/shared/ConversationMessage";
import { Spinner } from "@/components/ui/spinner";
import { startConversation } from "@/lib/api/chat.api";
import { useEffect, useState } from "react";

export default function MessageMobile() {
  const params = useParams();
  const [conversationId, setConversationId] = useState<string | null>(null);

  const { data, isLoading } = useSWR(
    `/api/users/id?id=${params?.chat_id}`,
    nextFetcher,
  );

  useEffect(() => {
    if (!params?.chat_id) return;
    startConversation(params.chat_id as string)
      .then((conversation) => setConversationId(conversation._id))
      .catch((err) => console.error("Gagal memulai percakapan:", err));
  }, [params?.chat_id]);

  return (
    <main>
      <div className="fixed bottom-0 left-0 z-30 lg:hidden">
        <NavigationMenuMobile />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <ConversationMessage
          conversationId={conversationId}
          with_back_button
          avatarUrl={data?.data?.avatarUrl}
          online_status="offline"
          username={data?.data?.username ?? data?.data?.name}
          participant_id={data?.data?._id}
        />
      )}
    </main>
  );
}
