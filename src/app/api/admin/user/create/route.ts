import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { username, email, password, position, direction } = await req.json()

  if (!email || !password || !username) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 })
  }

  try {
    const flaskRes = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, position, direction }),
    })

    const data = await flaskRes.json()

    if (!flaskRes.ok) {
      return NextResponse.json({ message: data.message || "Flask API error" }, { status: flaskRes.status })
    }

    return NextResponse.json({ message: "User registered successfully", flaskResponse: data })
  } catch (error) {
    console.error("Error calling Flask API:", error)
    return NextResponse.json({ message: "Server error connecting to Flask API" }, { status: 500 })
  }
}
