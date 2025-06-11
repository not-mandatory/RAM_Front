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


export async function getAllProjectEvaluations() {
  const res = await fetch("http://localhost:3000/api/project/AllEvaluations", {
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
  const res = await fetch("http://localhost:3000/api/project/projectAnalysis", {
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
  const res = await fetch(`/api/project/evaluate/${id}`, {
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


export async function getProjectTeam(id: string): Promise<{
  team_leader: { name: string; position: string; direction: string }
  team_members: Array<{ name: string; position: string; direction: string }>
} | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/project/${id}/team`)

    if (!response.ok) {
      console.error(`Failed to fetch team data: ${response.status}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching team data:", error)
    return null
  }
}


