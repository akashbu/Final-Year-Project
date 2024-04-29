import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

export async function POST(request) {
  try {
    const { first_name, last_name, email, password } = await request.json();
    await connectMongoDB();
    
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    
    await User.create({ first_name, last_name, email, password: hashedPassword });
    
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
