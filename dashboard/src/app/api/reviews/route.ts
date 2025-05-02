import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const cafeteriaId = searchParams.get('cafeteriaId');

  if (!cafeteriaId) {
    return NextResponse.json({ success: false, message: 'Missing cafeteriaId' }, { status: 400 });
  }

  const reviews = await Review.find({ cafeteriaId })
    .populate('userId', 'name email')
    .populate('foodId', 'foodName');

  return NextResponse.json({ success: true, reviews });
}
