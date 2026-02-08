import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const apiKey = process.env.WEATHERAPI_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing key' }, { status: 500 });
  }

  let query = q;
  if (!query && lat && lon) {
    query = `${lat},${lon}`;
  }

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const response = await fetch(`${BASE_URL}?key=${apiKey}&q=${encodeURIComponent(query)}&days=1`);
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}
