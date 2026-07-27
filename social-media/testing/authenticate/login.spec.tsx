import { render, screen, waitFor } from "@testing-library/react";
import { vi, test, beforeEach } from "vitest";
import LoginForm from "@/components/forms/LoginForm";
import userEvent from "@testing-library/user-event";
import * as authApi from "@/lib/api/auth.api";
import { pushMock } from "../mocks/router";

// setup agar bisa memangil api login route
vi.mock("@/lib/api/auth.api", () => ({
  loginWithEmail: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("authenticate_login_email_success", async () => {
  const user = userEvent.setup();
  vi.mocked(authApi.loginWithEmail).mockResolvedValue({
    success: true,
  });

  render(<LoginForm />);

  await user.type(
    screen.getByPlaceholderText("Email address"),
    "oyo@gmail.com",
  );
  await user.type(screen.getByPlaceholderText("Password"), "qweqweqwe");
  await user.click(screen.getByRole("button", { name: /Sign in/i }));

  await waitFor(() => {
    expect(authApi.loginWithEmail).toHaveBeenCalledWith({
      email: "oyo@gmail.com",
      password: "qweqweqwe",
    });

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});

beforeEach(() => {
  vi.clearAllMocks();
});

test("authenticate_login_email_failed", async () => {
  const user = userEvent.setup();
  vi.mocked(authApi.loginWithEmail).mockImplementation(() => {
    console.log("reject");
    return Promise.reject(new Error("Email atau password salah"));
  });

  render(<LoginForm />);

  await user.type(
    screen.getByPlaceholderText(/Email address/i),
    "oyo@gmail.com",
  );

  await user.type(screen.getByPlaceholderText(/Password/i), "123456789");

  await user.click(screen.getByRole("button", { name: /Sign in/i }));

  await waitFor(() => {
    expect(authApi.loginWithEmail).toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();

    expect(screen.getByText("Email atau password salah")).toBeInTheDocument();
  });
});
