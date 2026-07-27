import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { routerMock } from "./testing/mocks/router";
import { PropsWithChildren } from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: () => <button>Google Login</button>,
  GoogleOAuthProvider: ({ children }: PropsWithChildren) => children,
}));
