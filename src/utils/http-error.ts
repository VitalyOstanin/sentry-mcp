import axios from "axios";

export function normalizeAxiosError(e: unknown, id: string): { id: string; status?: number; message: string } {
  if (axios.isAxiosError(e)) {
    return { id, status: e.response?.status, message: e.message };
  }
  if (e instanceof Error) {
    return { id, message: e.message };
  }

  return { id, message: "Unknown error" };
}

