import { API_CONFIG } from "./ApiConfig";
import { Friendship } from "@/types/types";
import { getToken } from "./auth";

export async function getFriends(): Promise<Friendship[]> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log(`Fetching friends from: ${API_CONFIG.BASE_URL}/api/Friendship`);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Friendship`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log(`Friends API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Friends API error response: ${errorData}`);
      throw new Error(errorData || `Failed to fetch friends (Status: ${response.status})`);
    }

    const data = await response.json();
    console.log(`Friends API response data: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
} 