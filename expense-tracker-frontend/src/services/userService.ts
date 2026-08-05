import api from "../api/client";
import type { UserProfile } from "../types/user";

export async function getProfile(): Promise<UserProfile> {
const response = await api.get(
"/users/me"
);

return response.data;
}

export async function updateProfile(
  name: string
): Promise<UserProfile> {
  const response = await api.patch(
    "/users/me",
    {
      name,
    }
  );

  return response.data;
}