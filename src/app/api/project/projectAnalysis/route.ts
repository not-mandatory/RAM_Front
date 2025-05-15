// app/api/projects/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Proxy request to Flask API (adjust URL if needed)
    const res = await fetch("http://localhost:5000/admin/projects/summary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is ok
    if (!res.ok) {
      throw new Error("Failed to fetch projects from Flask");
    }

    const data = await res.json();
    console.log("Response from API:", data);
    
    // Assuming the response is in JSON format
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}