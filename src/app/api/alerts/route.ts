import connectDB from '../../../../backend/connectdb';
import Alert from '../../../../backend/models/schema';
import { NextResponse } from 'next/server';

export async function POST(req : any) {
  await connectDB();
  const { email, symbol, targetPrice, direction } = await req.json();

  const newAlert = new Alert({ userEmail: email, symbol, targetPrice, direction });
  await newAlert.save();

  return NextResponse.json({ message: 'Alert saved successfully!' });
}
