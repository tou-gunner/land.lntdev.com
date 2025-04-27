import { NextRequest, NextResponse } from 'next/server';

interface Village {
  provinceid: string;
  provincename: string;
  districtid: string;
  districtname: string;
  villageid: string;
  villagename: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const districtCode = searchParams.get('district') || '';
    
    // Validate required parameter
    if (!districtCode) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter: district" },
        { status: 400 }
      );
    }
    
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/utility/villages?district=${districtCode}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch villages" },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching villages:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 