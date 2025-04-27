import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parcelId = searchParams.get('parcel') || '';
    
    // Validate required fields
    if (!parcelId) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter: parcel" },
        { status: 400 }
      );
    }
    
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const url = `${API_BASE_URL}/parcel/pdf?parcel=${parcelId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "ບໍ່ສາມາດຊອກຫາເອກະສານ PDF ສຳລັບຕອນດິນນີ້" },
        { status: response.status }
      );
    }
    
    // Get the PDF content as an ArrayBuffer
    const pdfData = await response.arrayBuffer();
    
    // Return the PDF file directly with appropriate headers
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 