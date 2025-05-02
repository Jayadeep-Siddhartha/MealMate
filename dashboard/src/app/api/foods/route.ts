import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Food from '@/models/Food';
import Cafeteria from '@/models/Cafeteria';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const cafeteriaId = searchParams.get('cafeteriaId');

  if (!cafeteriaId) {
    return NextResponse.json({ success: false, message: 'Missing cafeteriaId' }, { status: 400 });
  }

  try {
    const cafeteria = await Cafeteria.findById(cafeteriaId).populate('menu');
    if (!cafeteria) {
      return NextResponse.json({ success: false, message: 'Cafeteria not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, foods: cafeteria.menu });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { cafeteriaId, ...foodData } = body;

  try {
    const newFood = await Food.create({ ...foodData, cafeteriaId });
    await Cafeteria.findByIdAndUpdate(cafeteriaId, { $push: { menu: newFood._id } });
    return NextResponse.json({ success: true, food: newFood });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
