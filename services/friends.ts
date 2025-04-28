import { API_CONFIG } from "./ApiConfig";
import { Friendship } from "@/types/types";
import { getToken } from "./auth";

export async function getFriends(): Promise<Friendship[]> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/Friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to fetch friends");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
} 