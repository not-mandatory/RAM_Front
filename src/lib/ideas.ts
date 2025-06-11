import { Idea } from "@/types/idea"


export async function getIdeas() {
    const res = await fetch("/api/idea/getIdeas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional but useful for always fetching fresh data
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch projects from the API");
    }
  
    return res.json();
  }

  

  



  export async function getIdeaById(id: string) {
    const res = await fetch(`/api/idea/getIdeaById/${id}`)
    if (!res.ok) throw new Error("Failed to fetch idea")
    return res.json()
  }
  