import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.weatherapi.com/v1/search.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const apiKey = process.env.WEATHERAPI_KEY;

  if (!apiKey || !query) {
    return NextResponse.json([], { status: 200 });
  }

  const response = await fetch(`${BASE_URL}?key=${apiKey}&q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    return NextResponse.json([], { status: 200 });
  }
  const data = await response.json();
  const normalized = data.map((item: any) => ({
    id: String(item.id ?? `${item.name}-${item.lat}`),
    name: item.name,
    region: item.region,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
  return NextResponse.json(normalized, { status: 200 });
}
