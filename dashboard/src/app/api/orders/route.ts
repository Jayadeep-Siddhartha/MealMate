import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import User from '@/models/User'; // Import User model
import Food from '@/models/Food'; // Import Food model

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get cafeteriaId from query params
    const searchParams = request.nextUrl.searchParams;
    const cafeteriaId = searchParams.get('cafeteriaId');
    
    if (!cafeteriaId) {
      return NextResponse.json({ error: 'Cafeteria ID is required' }, { status: 400 });
    }
    
    console.log("Searching for order");
    
    // Force registration of User and Food models before using them in populate
    const UserModel = User; // This ensures the User model is registered
    const FoodModel = Food; // This ensures the Food model is registered
    
    const orders = await Order.find({ cafeId: cafeteriaId })
      .populate('userId', 'email') 
      .populate('foodItems.foodId', 'foodName price');
    console.log(orders);
    console.log("Searched for order");
    
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const newOrder = await Order.create(body);
    
    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}