import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parcelno = searchParams.get('parcelno') || '';
    const mapno = searchParams.get('mapno') || '';
    
    // Validate required parameters
    if (!parcelno || !mapno) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters: parcelno and mapno" },
        { status: 400 }
      );
    }
    
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/parcel/parcel_info?parcelno=${parcelno}&mapno=${mapno}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch parcel info" },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching parcel info:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 