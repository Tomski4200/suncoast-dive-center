import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { location: string } }
) {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('location', params.location)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(null);
      }
      console.error('Error fetching promotion:', error);
      return NextResponse.json({ error: 'Failed to fetch promotion' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in promotion API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { location: string } }
) {
  try {
    const body = await request.json();
    const { heading, subheading, button_text, button_link, is_active } = body;

    const { data, error } = await supabase
      .from('promotions')
      .update({
        heading,
        subheading,
        button_text,
        button_link,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('location', params.location)
      .select()
      .single();

    if (error) {
      console.error('Error updating promotion:', error);
      return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in promotion update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
