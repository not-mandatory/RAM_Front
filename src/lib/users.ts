export async function getUsers() {
    const res = await fetch("http://localhost:3000/api/admin/user/getAll", {
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


  export async function createUser(projectData: object) 
  {
    const res = await fetch("/api/admin/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
       // Include cookies for session management
      body: JSON.stringify(projectData),
    });
  
    if (!res.ok) {
      throw new Error("Failed to create project");
    }

    console.log("User created successfully");
  
    return res.json();
  }