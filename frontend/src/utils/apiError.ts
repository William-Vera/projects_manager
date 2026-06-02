import axios from "axios";

export function getApiErrorMessage(error: unknown, fallback = "Error inesperado"): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message;
    if (typeof msg === "string") return msg;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
