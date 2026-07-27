import { nextFetcher } from "../fetcher";

export async function getNotification(url: string) {
  const res = await nextFetcher(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.success) throw new Error("Gagal mengambil users");
  return res;
}
