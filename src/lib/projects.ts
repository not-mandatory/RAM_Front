// lib/projects.ts

export async function getProjects() {
  const res = await fetch("/api/project/getAll", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // optional but useful for always fetching fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects from the API");
  }

   // Log the response for debugging

  return res.json();
}

export async function getUserProjects() {

  
  const res = await fetch("http://localhost:5000/projects/all", {
    method: "GET",
    credentials: "include",
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



// Get project by ID - called from Next.js API route
export const getProjectById = async (id: string) => {

  console.log("inside lib project with ID:", id)
  try {
    const res = await fetch(`http://localhost:3000/api/project/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // optional but useful for always fetching fresh data
    });
    return res.json();

  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}; 

import {API_URL} from "@/config"


export async function getAllProjectEvaluations() {
  const res = await fetch(`${API_URL}/api/project/AllEvaluations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects from the API");
  }

  const data = await res.json();
  console.log("Response from API gettttpevaluations:", data); // ← Now logs the actual data
  return data;
}


export async function getProjectStatistics() {
  const res = await fetch(`${API_URL}/api/project/projectAnalysis`, {
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


export async function getProjectEvaluationsById(id: string) {
  const res = await fetch(`${API_URL}/api/project/evaluate/${id}`, {
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

export async function createProject(projectData: object) 
{
  const res = await fetch("/api/project/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}


type UserFromBackend = {
    id: number;
    username: string; // Use username as your backend returns it
    position: string;
    direction: string;
    is_team_lead: boolean;
    email?: string; // If email is included
};

// Define the type for the comprehensive project details, including the team
export interface ProjectDetails {
    id: string;
    title: string;
    description: string;
    image_path: string;
    category: string;
    createdAt?: string; // Optional, if not always present
    team: { // This structure comes from your combined backend endpoint
        team_leader: UserFromBackend | null;
        team_members: UserFromBackend[];
    };
    // Add any other top-level project properties here if your backend returns them
}


export async function getProjectDetails(id: string): Promise<ProjectDetails | null> {
    console.log("Fetching comprehensive project details for ID:", id);
    try {
        // IMPORTANT: Ensure this URL points to your Flask backend (http://localhost:5000)
        // and matches the combined endpoint path.
        const response = await fetch(`http://localhost:5000/project/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // You might need an Authorization header here if this route is JWT protected
                // 'Authorization': `Bearer ${yourJwtToken}`
            },
            cache: "no-store", // Useful for always fetching fresh data, especially for edit pages
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Project with ID ${id} not found.`);
                return null;
            }
            const errorData = await response.json();
            console.error(`Failed to fetch project details for ID ${id}:`, errorData);
            throw new Error(errorData.error || `Failed to fetch project details: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Successfully fetched project details:", data);
        return data as ProjectDetails; // Cast to ProjectDetails type
    } catch (error) {
        console.error("Error fetching project details:", error);
        return null; // Return null on error
    }
}



