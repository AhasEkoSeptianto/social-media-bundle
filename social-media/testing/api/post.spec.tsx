import { describe, it, vi, expect } from "vitest";
import * as fetcher from "@/lib/fetcher";
import { createPost } from "@/lib/api/posts.api";

vi.mock("@/lib/fetcher", () => ({
  nextFetcher: vi.fn(),
}));

describe("create post", () => {
  it("should call nextFetcher", async () => {
    // Mock response
    vi.mocked(fetcher.nextFetcher).mockResolvedValue({
      success: true,
    });

    const file = new File(["hello"], "hello.png");

    await createPost({
      content: "Hello World",
      image: file,
    });

    expect(fetcher.nextFetcher).toHaveBeenCalledWith(
      "/api/posts/create",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      }),
    );

    // Ambil FormData yang dikirim
    expect(fetcher.nextFetcher).toHaveBeenCalledTimes(1);

    const [[url, options]] = vi.mocked(fetcher.nextFetcher).mock.calls;

    expect(url).toBe("/api/posts/create");

    const body = options?.body as FormData;

    expect(body.get("content")).toBe("Hello World");
    expect(body.get("image")).toBe(file);
  });
});
