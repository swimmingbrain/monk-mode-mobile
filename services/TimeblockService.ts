import { ErrorResponse, TimeBlock } from "@/types/types";
import { API_CONFIG } from "./ApiConfig";

export async function getTimeBlocks(token: string): Promise<TimeBlock[]> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/TimeBlock`, {
      method: "GET",
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      const errorData = await response.text();
      const parsedError = JSON.parse(errorData) as ErrorResponse;
      throw new Error(parsedError.message);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching time blocks:", error);
    throw error;
  }
}
