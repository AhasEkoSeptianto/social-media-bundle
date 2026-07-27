// lib/fetcher.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

type JsonBody = Record<string, unknown>;
type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: JsonBody | FormData;
  headers?: Record<string, string>;
  credentials?: string;
};

export const fetcher = async (url: string, options: ApiOptions = {}) => {
  const res = await fetch(`${API_URL}${url}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = new Error("Terjadi kesalahan saat fetch data");
    // (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

export const nextFetcher = async (url: string, options: ApiOptions = {}) => {
  // const isFormData = options.body instanceof FormData;
  const body =
    options.body instanceof FormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined;

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...options.headers,
  };
  const res = await fetch(`${url}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers,
    body,
  });

  if (!res) {
    const error = new Error("Terjadi kesalahan saat fetch data");
    // (error as any).status = res;
    throw error;
  }

  return res.json();
};
