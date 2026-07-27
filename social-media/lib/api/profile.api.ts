import { nextFetcher } from "../fetcher";

export async function updateProfile(
  username: string,
  image: File | null,
  bio: string,
  tag: string[] | null | any,
) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("bio", bio);

  if (tag) {
    formData.append("tag", tag);
  }

  if (image) {
    formData.append("image", image);
  }

  const res = await nextFetcher("/api/profile", {
    method: "PUT",
    body: formData,
  });
  if (!res.success) throw new Error("Gagal mengambil posts");
  return res;
}
