// app/api/projects/route.ts

import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  

  try {
    const flaskRes = await fetch("http://localhost:5000/projects/all", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
         // only add if token exists
      },
    });

    if (!flaskRes.ok) {
      console.error("Flask error:", await flaskRes.text());
      return new NextResponse("Failed to fetch projects from Flask", {
        status: flaskRes.status,
      });
    }

    const data = await flaskRes.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Unexpected error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
