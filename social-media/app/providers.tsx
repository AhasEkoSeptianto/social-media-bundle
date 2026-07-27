"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";
import { useSocketStore } from "@/store/socket.store";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      <Toaster />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <TooltipProvider>
          <SWRConfig
            value={{
              refreshInterval: 3000,
              fetcher: (resource, init) =>
                fetch(resource, init).then((res) => res.json()),
            }}
          >
            {children}
          </SWRConfig>
        </TooltipProvider>
      </GoogleOAuthProvider>
    </SWRConfig>
  );
}
