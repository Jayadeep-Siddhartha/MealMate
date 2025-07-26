import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Food from '@/models/Food';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const updates = await req.json();
  const id = params.id; // ✅ Safe to access here

  const food = await Food.findByIdAndUpdate(id, updates, { new: true });

  if (!food) {
    return NextResponse.json(
      { success: false, message: 'Food not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, food });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const id = params.id;

  const food = await Food.findByIdAndDelete(id);

  if (!food) {
    return NextResponse.json(
      { success: false, message: 'Food not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
