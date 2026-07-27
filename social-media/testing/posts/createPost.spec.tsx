import { vi, test, beforeEach } from "vitest";
import * as postApi from "@/lib/api/posts.api";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import PostStory from "@/components/shared/PostStory";

// setup agar bisa memangil api login route
vi.mock("@/lib/api/posts.api", () => ({
  createPost: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("create_post", async () => {
  const user = userEvent.setup();

  render(<PostStory />);

  await user.type(
    screen.getByPlaceholderText("whats on your mind?"),
    "Hello World",
  );

  const file = new File(["hello"], "hello.png", { type: "image/png" });

  const input = screen.getByLabelText(
    /Upload file Posts:/i,
  ) as HTMLInputElement;

  await user.upload(input, file);

  expect(input.files?.[0]).toBe(file);

  await user.click(screen.getByRole("button", { name: "Post" }));

  await waitFor(() => {
    expect(postApi.createPost).toHaveBeenCalledWith({
      content: "Hello World",
      image: file,
    });

    expect(postApi.createPost).toHaveBeenCalledTimes(1);
  });
});
