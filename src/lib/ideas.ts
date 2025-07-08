import { Idea } from "@/types/idea"
import {API_URL} from "@/config"


export async function getIdeas() {
    const res = await fetch(`${API_URL}/api/idea/getIdeas`, {
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

  

  



  export async function getIdeaDetails(id: string): Promise<Idea | null> {
    console.log(`Fetching idea details for ID: ${id}`);
    try {
        // Ensure this URL points to your Flask backend (http://localhost:5000)
        // and matches your idea details endpoint.
        const response = await fetch(`http://localhost:5000/api/idea/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Include authorization header if your ideas endpoint is protected
                // 'Authorization': `Bearer ${yourAccessToken}`,
            },
            cache: "no-store", // Useful for always fetching fresh data
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Idea with ID ${id} not found.`);
                return null;
            }
            const errorData = await response.json();
            console.error(`Failed to fetch idea details for ID ${id}:`, errorData);
            throw new Error(errorData.error || `Failed to fetch idea details: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Successfully fetched idea details:", data);
        return data as Idea; // Cast the raw JSON data to your Idea interface
    } catch (error) {
        console.error("Error fetching idea details:", error);
        return null; // Return null on any network or parsing error
    }
}
  