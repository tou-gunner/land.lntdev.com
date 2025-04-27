import { NextRequest, NextResponse } from 'next/server';

interface Province {
  provincecode: string;
  province_english: string;
  province_lao: string;
}

export async function GET(request: NextRequest) {
  try {
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/utility/provinces`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch provinces" },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 