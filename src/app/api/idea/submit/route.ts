import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { description, title, category } = await req.json()

  console.log("Received data:", { description, title })
  

  if (!description || !title) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 })
  }

  try {
    // Extract the cookie header from the incoming request, if present
    const cookieHeader = req.headers.get("cookie") || "";

    const flaskRes = await fetch("http://localhost:5000/api/idea/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader, // Forward the token to Flask if it exists
      },
      body: JSON.stringify({ description, title, category }),
    })

    const data = await flaskRes.json()

    if (!flaskRes.ok) {
      return NextResponse.json({ message: data.message || "Flask API error" }, { status: flaskRes.status })
    }

    console.log("Flask API response:", data)

    return NextResponse.json({ message: "idea classified successfully", flaskResponse: data })
  } catch (error) {
    console.error("Error calling Flask API:", error)
    return NextResponse.json({ message: "Server error connecting to Flask API" }, { status: 500 })
  }
}
