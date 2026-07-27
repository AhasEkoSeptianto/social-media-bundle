"use client";

import { socket } from "@/lib/socket";
import useSWR from "swr";
import { useEffect, useRef } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  bio: string;
  tag: any;
  avatarUrl?: string;
  username?: string;
  postCount?: number;
  followingCount: number;

  followerCount: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = new Error("Terjadi kesalahan saat fetch data");
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

export function useUser() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<{
    success: boolean;
    user: User;
  }>("/api/auth/check", fetcher, {
    shouldRetryOnError: false,
    refreshInterval: 5000,
  });

  const userId = data?.user?.id;
  const wasLoggedIn = useRef(false); // lacak status login SEBELUMNYA

  useEffect(() => {
    if (userId) {
      // Baru login / masih login -- kirim event login
      // (aman dikirim berulang, server cuma nge-update Map, bukan masalah kalau dobel)
      socket.emit("login", userId);
      wasLoggedIn.current = true;
    } else if (wasLoggedIn.current) {
      // Sebelumnya login, SEKARANG tidak lagi -- ini momen logout terdeteksi
      socket.emit("logout");
      wasLoggedIn.current = false;
    }
  }, [userId]); // cuma jalan ulang kalau userId BERUBAH, bukan tiap render

  return {
    user: data?.user,
    isLoading,
    isError: error,
    isLogin: !!data?.user,
    mutate,
    isValidating,
  };
}
