import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.BACKEND_INTERNAL_URL; // https://social-media-be-4888.vercel.app

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(`${EXPRESS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  const res = NextResponse.json(data, { status: backendRes.status });

  // Forward Set-Cookie dari backend, tapi sekarang cookie ini
  // akan disimpan browser dengan domain = Netlify (karena response-nya
  // datang dari Netlify API route, bukan langsung dari Vercel)
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    res.headers.set("set-cookie", setCookie);
  }

  return res;
}
