import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 })
  }

  try {
    const flaskRes = await fetch("https://localhost:5000/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password }),
    })

    const data = await flaskRes.json()

    if (!flaskRes.ok) {
      return NextResponse.json({ message: data.message || "Flask API error" }, { status: flaskRes.status })
    }

    console.log(NextResponse.json({ message: "User registered successfully", flaskResponse: data }))
    return NextResponse.json({ message: "User registered successfully", flaskResponse: data })
  } catch (error) {
    console.error("Error calling Flask API:", error)
    return NextResponse.json({ message: "Server error connecting to Flask API" }, { status: 500 })
  }
}
