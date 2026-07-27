import Comment from "@/components/freatures/comment/Comment";
import { getComment, createComment } from "@/lib/api/posts.api";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api/posts.api", () => ({
  getComment: vi.fn(),
  createComment: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(getComment).mockResolvedValue({
    success: true,
  });

  vi.mocked(createComment).mockResolvedValue({
    success: true,
  });
});

it("should call comment", async () => {
  const user = userEvent.setup();

  render(<Comment post_id={"post-1"} />);

  expect(getComment).toHaveBeenCalled();

  const input = screen.getByPlaceholderText("comment..", { exact: true });
  await user.type(input, "Hello world");

  const buttonSubmit = screen.getByRole("button", { name: "Submit comment" });
  await user.click(buttonSubmit);

  await waitFor(() => {
    expect(createComment).toHaveBeenCalledWith("post-1", "Hello world");

    expect(getComment).toHaveBeenCalled();
  });
});
