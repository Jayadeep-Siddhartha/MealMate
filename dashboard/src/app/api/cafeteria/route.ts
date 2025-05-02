import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CafeOwner from '@/models/CafeOwner';
import Cafeteria from '@/models/Cafeteria';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const firebaseId = searchParams.get('ownerId');

  if (!firebaseId) {
    return NextResponse.json({ success: false, message: 'Missing ownerId' }, { status: 400 });
  }

  const owner = await CafeOwner.findOne({ firebaseId }).populate('cafeteria');
  if (!owner || !owner.cafeteria) {
    return NextResponse.json({ success: false, message: 'Cafeteria not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, cafeteria: owner.cafeteria });
}

export async function PUT(req: Request) {
  await dbConnect();
  const body = await req.json();
  const {
    ownerId,
    cafeteriaName,
    location,
    availableSeats,
    cafeImage,
  } = body;

  const owner = await CafeOwner.findOne({ firebaseId: ownerId });
  if (!owner) {
    return NextResponse.json({ success: false, message: 'Owner not found' }, { status: 404 });
  }

  const cafeteriaUpdates: any = {};
  if (cafeteriaName !== undefined) cafeteriaUpdates.cafeteriaName = cafeteriaName;
  if (location !== undefined) cafeteriaUpdates.location = location;
  if (availableSeats !== undefined) cafeteriaUpdates.availableSeats = availableSeats;
  if (cafeImage !== undefined) cafeteriaUpdates.cafeImage = cafeImage;

  let cafeteria;

  if (owner.cafeteria) {
    cafeteria = await Cafeteria.findByIdAndUpdate(
      owner.cafeteria,
      { $set: cafeteriaUpdates },
      { new: true }
    );
  } else {
    cafeteria = await Cafeteria.create(cafeteriaUpdates);
    owner.cafeteria = cafeteria._id;
    await owner.save();
  }

  return NextResponse.json({ success: true, cafeteria });
}
