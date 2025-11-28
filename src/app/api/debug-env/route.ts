import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? null;
  const present = Boolean(key);
  const masked = key ? (key.length > 8 ? `${key.slice(0,4)}...${key.slice(-4)}` : '****') : null;

  return NextResponse.json({ present, masked });
}
