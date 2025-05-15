import { type NextRequest, NextResponse } from "next/server"

// Define the base URL for your backend API
const BASE_URL = "http://localhost:5000" // Adjust this to your actual backend URL

export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const projectId = params.id

  console.log("Fetching team data for project ID:", projectId)

  try {
    // Make the request to your backend API
    const response = await fetch(`${BASE_URL}/projects/${projectId}/team`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward authorization header if present
        ...(request.headers.get("Authorization")
          ? { Authorization: request.headers.get("Authorization") as string }
          : {}),
      },
      // This is important for handling cookies if your API uses them
      credentials: "include",
    })

    // If the backend returns an error, forward it
    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: "Failed to fetch team data from backend" }, { status: response.status })
    }

    // Get the response data
    const teamData = await response.json()

    // Return the team data
    return NextResponse.json(teamData)
  } catch (error) {
    console.error("Error fetching team data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
