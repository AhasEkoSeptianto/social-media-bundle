import { NextRequest, NextResponse } from "next/server";
const EXPRESS_API_URL = process.env.BACKEND_INTERNAL_URL;

// GET /api/chat/conversations -> daftar percakapan (inbox) milik user
export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const backendRes = await fetch(`${EXPRESS_API_URL}/api/chat/conversations`, {
    method: "GET",
    headers: { "Content-Type": "application/json", cookie: cookie ?? "" },
  });

  const data = await backendRes.json();
  const res = NextResponse.json(data, { status: backendRes.status });

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);

  return res;
}

// POST /api/chat/conversations -> buat/ambil percakapan dengan targetUserId
export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie");
  const body = await req.json();

  const backendRes = await fetch(`${EXPRESS_API_URL}/api/chat/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: cookie ?? "" },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();
  const res = NextResponse.json(data, { status: backendRes.status });

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);

  return res;
}
