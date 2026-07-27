import Feed from "@/components/freatures/feed/feed";
import { deletePost } from "@/lib/api/posts.api";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi, beforeEach } from "vitest";

const props = {
  _id: "post-1",
  postContext: "Hello World",
  images: "",
  likesCount: 5,
  commentsCount: 1,
  sharesCount: 0,
  isLiked: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  author: {
    _id: "user-1",
    name: "Ahas",
    avatarUrl: "",
    email: "",
  },
};

vi.mock("@/lib/api/posts.api", () => ({
  deletePost: vi.fn(),
}));

vi.mock("@/hooks/posts/usePosts", () => ({
  usePosts: () => ({
    mutate: mutateMock,
  }),
}));

vi.mock("@/hooks/auths/useUser", () => ({
  useUser: () => ({
    user: {
      id: "user-1",
    },
    mutate: vi.fn(),
  }),
}));

const mutateMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(deletePost).mockResolvedValue({
    success: true,
  });
});

it("should call delete post when like button clicked", async () => {
  const user = userEvent.setup();

  render(<Feed {...props} />);

  const buttonPopover = screen.getByRole("button", {
    name: "Popover options post",
  });
  await user.click(buttonPopover);

  const button = screen.getByRole("button", {
    name: "Delete post",
  });

  await user.click(button);

  await waitFor(() => {
    expect(deletePost).toHaveBeenCalledWith("post-1");
    expect(mutateMock).toHaveBeenCalledOnce();
  });
});
