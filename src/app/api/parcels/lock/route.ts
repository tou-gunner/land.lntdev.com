import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { user_name, parcel } = body;
    
    // Validate required fields
    if (!user_name || !parcel) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: user_name and parcel" },
        { status: 400 }
      );
    }
    
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/parcel/user_lock_record`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user_name,
        parcel
      })
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to lock the parcel record" },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error locking parcel record:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 