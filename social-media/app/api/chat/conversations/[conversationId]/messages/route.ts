import { NextRequest, NextResponse } from "next/server";
const EXPRESS_API_URL = process.env.BACKEND_INTERNAL_URL;

// GET /api/chat/conversations/:conversationId/messages?page=1
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  const cookie = req.headers.get("cookie");
  const page = req.nextUrl.searchParams.get("page") ?? "1";

  const backendRes = await fetch(
    `${EXPRESS_API_URL}/api/chat/conversations/${conversationId}/messages?page=${page}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json", cookie: cookie ?? "" },
    },
  );

  const data = await backendRes.json();
  const res = NextResponse.json(data, { status: backendRes.status });

  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);

  return res;
}
