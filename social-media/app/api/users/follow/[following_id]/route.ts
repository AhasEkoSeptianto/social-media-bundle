// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";

const EXPRESS_API_URL = process.env.BACKEND_INTERNAL_URL; // https://social-media-be-4888.vercel.app

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ following_id: string }> },
) {
  const { following_id } = await params;
  const cookie = req.headers.get("cookie");
  const backendRes = await fetch(
    `${EXPRESS_API_URL}/api/follow/${following_id}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: cookie ?? "" },
    },
  );

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
