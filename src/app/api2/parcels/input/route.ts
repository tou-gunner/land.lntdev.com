import { NextRequest, NextResponse } from 'next/server';

interface ApiParcelItem {
  parcel: string;
  file_name: string;
  province_code: string;
  district_code: string;
  village_code: string;
  user_name: string | null;
  date_upload: string;
  province_lao: string | null;
  district_lao: string | null;
  village_lao: string | null;
  total_count: number;
  total_pages: number;
}

interface Parcel {
  gid: string;
  parcelno: string;
  cadastremapno: string;
  barcode: string;
  village: string;
  district: string;
  province: string;
  villageCode?: string;
  districtCode?: string;
  provinceCode?: string;
  userName?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageNo = searchParams.get('page_no') || '1';
    const offset = searchParams.get('offset') || '10';
    const province = searchParams.get('province') || '';
    const district = searchParams.get('district') || '';
    const village = searchParams.get('village') || '';
    const userName = searchParams.get('user_name') || '';
    
    // Use the environment variable for the API URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // Forward the request to the existing API
    const endpoint = "/parcel/list_parcels_filter_input";
    let url = `${API_BASE_URL}${endpoint}?page_no=${pageNo}&offset=${offset}`;
    
    if (province) url += `&province=${province}`;
    if (district) url += `&district=${district}`;
    if (village) url += `&village=${village}`;
    if (userName) url += `&user_name=${userName}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch parcels" },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: "Parcels fetched successfully",
      data: data.data,
      totalItems: data.data?.[0]?.total_count || 0
    });
  } catch (error) {
    console.error('Error fetching parcels:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 