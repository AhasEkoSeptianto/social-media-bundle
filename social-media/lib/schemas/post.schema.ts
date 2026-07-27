import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1, "Post wajib diisi"),
  image: z.instanceof(File).optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export const createCommentPostSchema = z.object({
  content: z.string().min(1, "Post wajib diisi"),
});

export type CreateCommentPostFormData = z.infer<typeof createCommentPostSchema>;
