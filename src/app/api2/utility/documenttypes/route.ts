import { NextRequest, NextResponse } from 'next/server';

interface DocumentType {
  doc_type: number;
  description_lao: string;
  group_id: number;
  group_name: string;
  object_name: string;
}

export async function GET(request: NextRequest) {
  try {
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/utility/documenttypes`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch document types" },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching document types:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 