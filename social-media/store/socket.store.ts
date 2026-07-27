import { create } from "zustand";
import { socket } from "@/lib/socket";

interface SocketStore {
  connected: boolean;

  connect: () => void;

  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  connected: false,

  connect() {
    socket.connect();

    set({
      connected: true,
    });
  },

  disconnect() {
    socket.disconnect();

    set({
      connected: false,
    });
  },
}));
