import { vi } from "vitest";

export const pushMock = vi.fn();

export const routerMock = {
  push: pushMock,
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};
