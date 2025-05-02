import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Food from '@/models/Food';
import Cafeteria from '@/models/Cafeteria';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const updates = await req.json();
  const food = await Food.findByIdAndUpdate(params.id, updates, { new: true });

  if (!food) {
    return NextResponse.json({ success: false, message: 'Food not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, food });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const food = await Food.findByIdAndDelete(params.id);
  if (!food) {
    return NextResponse.json({ success: false, message: 'Food not found' }, { status: 404 });
  }

  await Cafeteria.findByIdAndUpdate(food.cafeteriaId, { $pull: { menu: food._id } });
  return NextResponse.json({ success: true });
}
