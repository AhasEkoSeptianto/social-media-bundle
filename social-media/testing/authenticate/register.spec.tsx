import { render, screen, waitFor } from "@testing-library/react";
import { vi, test, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import * as authApi from "@/lib/api/auth.api";
import RegisterForm from "@/components/forms/RegisterForm";

// setup agar bisa memangil api login route
vi.mock("@/lib/api/auth.api", () => ({
  registerAccount: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("register_success", async () => {
  const user = userEvent.setup();
  vi.mocked(authApi.registerAccount).mockResolvedValue({
    success: true,
  });

  function getRandom(max: number) {
    return Math.floor(Math.random() * max);
  }

  render(<RegisterForm onSuccess={() => {}} />);
  const name = `testing_${getRandom(1000)}`;
  const email = `testing_${getRandom(1000)}@gmail.com`;
  const password = "qweqweqwe";

  await user.type(screen.getByPlaceholderText(/Name/i), name);
  await user.type(screen.getByPlaceholderText(/Email Address/i), email);

  await user.type(
    screen.getByPlaceholderText("Password", { exact: true }),
    password.toString(),
  );
  await user.type(
    screen.getByPlaceholderText("Confirm password", { exact: true }),
    password.toString(),
  );

  await user.click(screen.getByRole("button", { name: /Register/i }));

  await waitFor(() => {
    expect(authApi.registerAccount).toHaveBeenCalledWith({
      name: name,
      email: email,
      password: password,
      confirmPassword: password,
    });

    // expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
