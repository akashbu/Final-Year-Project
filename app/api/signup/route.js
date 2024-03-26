import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { first_name, last_name, email, password } = await request.json();
    await connectMongoDB();
    await User.create({ first_name, last_name, email, password });
    
    return NextResponse.json({ message: "User Sign Up Successful" }, { status: 201 });
  } catch (error) {
    // Check if the error is a duplicate key violation
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    } else {
      // Handle other errors
      return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 });
    }
  }
}
