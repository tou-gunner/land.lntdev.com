import { NextRequest, NextResponse } from 'next/server';

interface DocTypeRequest {
  parcel: string;
  page: number;
  doctype: string;
  rotate: number;
  user_name: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const docTypes: DocTypeRequest[] = await request.json();
    
    // Validate request body
    if (!Array.isArray(docTypes) || docTypes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request body format, expected array of document types" },
        { status: 400 }
      );
    }
    
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/parcel/pdf/update_document_type`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(docTypes),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to update document types" },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating document types:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 