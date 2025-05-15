import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, context: { params: { projectId: number } }) {
  const { projectId } = context.params
  const  {ratings}  = await req.json()

  console.log("Received ratings:", ratings)     


  const answers = [
    ratings.qst_1,
    ratings.qst_2,
    ratings.qst_3,
    ratings.qst_4,
    ratings.qst_bool ? 1 : 0
  ]


  console.log("Received ans:", JSON.stringify({ answers }))
  console.log("Received projectId:", projectId)
  const cookieHeader = req.headers.get("cookie") || ""
  
  try {
    const flaskRes = await fetch(`http://localhost:5000/evaluate/${projectId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Forward the token to Flask
        "Cookie": cookieHeader,
      },
      body: JSON.stringify({ answers }), // Flask expects 'answers'
    })

    const data = await flaskRes.json()

    if (!flaskRes.ok) {
      return NextResponse.json({ message: data.message || "Flask API error" }, { status: flaskRes.status })
    }

    return NextResponse.json({ message: "Project evaluated successfully", flaskResponse: data })
  } catch (error) {
    console.error("Error calling Flask API:", error)
    return NextResponse.json({ message: "Server error connecting to Flask API" }, { status: 500 })
  }
}
