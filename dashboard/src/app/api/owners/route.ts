import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CafeOwner from '@/models/CafeOwner';

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  try {
    const owner = await CafeOwner.create(body);
    return NextResponse.json({ success: true, owner }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating owner:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
