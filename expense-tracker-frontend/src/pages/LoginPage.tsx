import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
    
  ) {
      e.preventDefault();

      try {
        const data = await loginRequest(
          email,
          password
        );

        localStorage.setItem("email", email);
        await login(data.access_token);
        navigate("/dashboard");
      } catch {
        setError("Invalid email or password");
      }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg p-3"
        >
          Login
        </button>
        <p></p>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;