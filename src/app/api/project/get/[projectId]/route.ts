import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { projectId: string } }
  ) {
    try {
      const { projectId } = params
      
      const res = await fetch(`http://localhost:5000/project/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      if (!res.ok) {
        throw new Error(`Failed to fetch project with id ${projectId}`)
      }
  
      const data = await res.json()
      console.log("Project data:", data)
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error fetching project:", error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }
  }