import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parcelNo = searchParams.get('parcelno') || '';
    const cadastreMapNo = searchParams.get('cadastremapno') || '';
    
    // Validate at least one search parameter
    if (!parcelNo && !cadastreMapNo) {
      return NextResponse.json(
        { success: false, message: "At least one search parameter is required: parcelno or cadastremapno" },
        { status: 400 }
      );
    }
    
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/parcel/find?parcelno=${parcelNo}&cadastremapno=${cadastreMapNo}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to search land parcel" },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching land parcel:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 