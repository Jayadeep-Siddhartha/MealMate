import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { isCompleted } = await req.json();

  const order = await Order.findByIdAndUpdate(
    params.id,
    { isCompleted },
    { new: true }
  );

  if (!order) {
    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}
