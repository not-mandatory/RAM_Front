// Export the Project type to make it a module
export interface Project {
    id: string;
    title: string;
    description: string;
    already_evaluated: boolean;
    team_leader_id: string;
    team_member_ids: string[];
    created_at: string;
    image_path: string;
    category: string; 
  }