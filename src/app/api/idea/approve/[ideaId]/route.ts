import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { ideaId: string } }
  ) {
    try {
      const { ideaId } = params
      
      const res = await fetch(`http://localhost:5000/api/ideas/${ideaId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      if (!res.ok) {
        throw new Error(`Failed to fetch idea with id ${ideaId}`)
      }
  
      const data = await res.json()
      console.log("Idea Approval:", data)
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error fetching idea:", error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }
  }