import api from "../api/client";


/* Creating the auth service */

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

export async function register(data: {
name: string;
email: string;
password: string;
}) {
const response = await api.post(
"/auth/register",
data
);

return response.data;
}