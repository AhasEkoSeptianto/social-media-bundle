import { nextFetcher } from "../fetcher";

export async function following(following_id: string) {
  const res = await nextFetcher(`/api/users/follow/${following_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.success) throw new Error("Gagal mengambil users");
  return res;
}
