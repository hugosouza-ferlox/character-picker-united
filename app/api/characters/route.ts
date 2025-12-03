import { NextResponse } from 'next/server';
import { loadCharacters } from '@/lib/load-characters';

export async function GET() {
  try {
    const characters = await loadCharacters();
    return NextResponse.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ error: 'Failed to load characters' }, { status: 500 });
  }
}

