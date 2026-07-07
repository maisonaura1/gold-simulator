import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!backendUrl) {
    return NextResponse.json({ totalUsers: 0, totalTrades: 0 });
  }

  try {
    const res = await fetch(`${backendUrl}/api/stats/public`, {
      next: { revalidate: 300 }, // cache 5 min
    });
    if (!res.ok) return NextResponse.json({ totalUsers: 0, totalTrades: 0 });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ totalUsers: 0, totalTrades: 0 });
  }
}
