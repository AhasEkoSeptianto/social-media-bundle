// lib/api/posts.api.ts
import { API_URL, nextFetcher } from "../fetcher";
import { CreatePostFormData } from "../schemas/post.schema";

export async function getPosts(): Promise<CreatePostFormData> {
  const res = await fetch(`${API_URL}/api/posts`, { credentials: "include" });
  if (!res.ok) throw new Error("Gagal mengambil posts");
  return res.json();
}

export async function getStory(): Promise<CreatePostFormData> {
  const res = await nextFetcher(`${API_URL}/api/posts?type=story`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal mengambil posts");
  return res.json();
}

export async function getPostById(id: string): Promise<CreatePostFormData> {
  const res = await fetch(`${API_URL}/api/posts/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal mengambil post");
  return res.json();
}

export async function createPost(data: {
  content: string;
  image: File;
}): Promise<CreatePostFormData> {
  const formData = new FormData();

  formData.append("content", data.content);
  formData.append("image", data.image);

  const res = await nextFetcher(`/api/posts/create`, {
    credentials: "include",
    method: "POST",
    body: formData,
  });
  if (!res.success) throw new Error("Gagal membuat post");

  return res;
}

export async function deletePost(
  post_id: string,
): Promise<{ success: boolean }> {
  const res = await nextFetcher(`/api/posts/${post_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.success) throw new Error("Gagal membuat post");

  return res;
}

export async function likePost(post_id: string) {
  const res = await nextFetcher(`/api/posts/like/${post_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.success) throw new Error("Gagal membuat post");

  return res;
}

export async function createComment(post_id: string, content: string) {
  const res = await nextFetcher(`/api/posts/${post_id}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { content },
  });
  if (!res.success) throw new Error("Gagal mengambil posts");
  return res;
}

export async function getComment(url: string) {
  const res = await nextFetcher(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.success) throw new Error("Gagal mengambil posts");
  return res;
}
