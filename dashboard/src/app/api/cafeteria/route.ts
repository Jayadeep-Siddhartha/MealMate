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
  console.log("API received:", body);

  const {
    ownerId,
    cafeteriaName,
    location,
    availableSeats,
    cafeteriaImage,
  } = body;

  const owner = await CafeOwner.findOne({ firebaseId: ownerId });
  if (!owner) {
    return NextResponse.json({ success: false, message: 'Owner not found' }, { status: 404 });
  }

  let updatedCafeteria;

  if (owner.cafeteria) {
    const cafeteriaDoc = await Cafeteria.findById(owner.cafeteria);
    if (!cafeteriaDoc) {
      return NextResponse.json({ success: false, message: 'Cafeteria not found' }, { status: 404 });
    }

    console.log("Existing cafeteria doc before update:", cafeteriaDoc);

    // ✅ Directly update fields
    if (cafeteriaName !== undefined) cafeteriaDoc.cafeteriaName = cafeteriaName;
    if (location !== undefined) cafeteriaDoc.location = location;
    if (availableSeats !== undefined) cafeteriaDoc.availableSeats = availableSeats;
    if (cafeteriaImage !== undefined) cafeteriaDoc.cafeteriaImage = cafeteriaImage;

    console.log("Updating cafeteria with:", {
      cafeteriaName: cafeteriaDoc.cafeteriaName,
      location: cafeteriaDoc.location,
      availableSeats: cafeteriaDoc.availableSeats,
      cafeteriaImage: cafeteriaDoc.cafeteriaImage,
    });

    updatedCafeteria = await cafeteriaDoc.save(); // ✅ Explicit save

  } else {
    // ✅ New cafeteria case
    updatedCafeteria = await Cafeteria.create({
      cafeteriaName,
      location,
      availableSeats,
      cafeteriaImage,
    });
    owner.cafeteria = updatedCafeteria._id;
    await owner.save();
  }

  console.log("Updated cafeteria doc:", updatedCafeteria);
  return NextResponse.json({ success: true, cafeteria: updatedCafeteria });
}
