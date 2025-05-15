import type { NextRequest } from "next/server"

const BASE_URL = "http://localhost:5000" // Flask backend

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData()

    console.log("Received form data:", Object.fromEntries(formData.entries()))

    // Create a new FormData object to send to Flask
    const flaskFormData = new FormData()

    // Extract and add basic fields
    const title = formData.get("title")
    const description = formData.get("description")

    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    flaskFormData.append("title", title as string)

    if (description) {
      flaskFormData.append("description", description as string)
    }

    // Handle team lead ID - rename from teamLeadId to team_leader_id
    const teamLeadId = formData.get("teamLeadId")
    if (!teamLeadId) {
      return new Response(JSON.stringify({ error: "Team lead is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    flaskFormData.append("team_leader_id", teamLeadId as string)

    // Handle team members - convert from teamMembers array to team_member_ids JSON string
    const teamMembersJson = formData.get("teamMembers")
    if (teamMembersJson) {
      try {
        const teamMembers = JSON.parse(teamMembersJson as string)
        // Extract just the userIds into an array
        const teamMemberIds = teamMembers.map((member: { userId: string }) => member.userId)
        flaskFormData.append("team_member_ids", JSON.stringify(teamMemberIds))
      } catch (error) {
        console.error("Error parsing team members:", error)
        return new Response(JSON.stringify({ error: "Invalid team members format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
    } else {
      // If no team members, send an empty array
      flaskFormData.append("team_member_ids", JSON.stringify([]))
    }

    // Handle image upload
    const image = formData.get("image")
    if (image && image instanceof File) {
      // If there's an image file, we need to handle it
      // This depends on how your Flask backend handles file uploads
      // Option 1: Send the file directly in the FormData
      flaskFormData.append("image", image)
    } else {
      // Option 2: If there's an image URL instead of a file
      const imageUrl = formData.get("imageUrl")
      if (imageUrl) {
        flaskFormData.append("imageUrl", imageUrl as string)
      }

      // Option 3: If there's an existing image path
      const existingImagePath = formData.get("existingImagePath")
      if (existingImagePath) {
        flaskFormData.append("image_path", existingImagePath as string)
      }
    }

    console.log("Sending to Flask:", Object.fromEntries(flaskFormData.entries()))

    // Send the form data to Flask
    const flaskResponse = await fetch(`${BASE_URL}/admin/project/create`, {
      method: "POST",
      body: flaskFormData,
      // Don't set Content-Type header when sending FormData
      // The browser will automatically set it with the correct boundary
    })

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text()
      console.error("Flask error response:", errorText)

      try {
        // Try to parse as JSON
        const errorJson = JSON.parse(errorText)
        return new Response(JSON.stringify(errorJson), {
          status: flaskResponse.status,
          headers: { "Content-Type": "application/json" },
        })
      } catch (e) {
        // If not JSON, return as text
        return new Response(JSON.stringify({ error: errorText }), {
          status: flaskResponse.status,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    const result = await flaskResponse.json()
    console.log("Flask response:", result)

    return new Response(JSON.stringify(result), {
      status: flaskResponse.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error forwarding to Flask:", error)
    return new Response(JSON.stringify({ error: "Internal server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
