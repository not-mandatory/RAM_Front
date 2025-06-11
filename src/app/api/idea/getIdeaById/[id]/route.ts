import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params
      
      const res = await fetch(`http://localhost:5000/api/idea/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      if (!res.ok) {
        throw new Error(`Failed to fetch idea with id ${id}`)
      }
  
      const data = await res.json()
      console.log("Idea data:", data)
      return NextResponse.json(data)
    } catch (error) {
      console.error("Error fetching idea:", error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }
  }