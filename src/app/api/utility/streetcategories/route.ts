import { NextRequest, NextResponse } from 'next/server';

interface ApiItem {
  id: number | string;
  description_lao: string;
  description_english: string;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  try {
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/utility/streetcategories`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch road types" },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching road types:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 