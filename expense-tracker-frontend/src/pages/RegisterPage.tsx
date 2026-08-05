import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

function RegisterPage() {
const navigate = useNavigate();
const { login: authLogin } = useAuth();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] =
useState("");
const [confirmPassword, setConfirmPassword] =
useState("");

const [errors, setErrors] = useState({
name: "",
email: "",
password: "",
confirmPassword: "",
});

const [loading, setLoading] =
useState(false);

const [toast, setToast] = useState({
message: "",
type: "success" as
| "success"
| "error",
visible: false,
});

function showToast(
message: string,
type: "success" | "error"
) {
setToast({
message,
type,
visible: true,
});


setTimeout(() => {
  setToast((prev) => ({
    ...prev,
    visible: false,
  }));
}, 3000);

}

function validate() {
const newErrors = {
name: "",
email: "",
password: "",
confirmPassword: "",
};

let isValid = true;

if (!name.trim()) {
  newErrors.name =
    "Full name is required";
  isValid = false;
}

if (!email.trim()) {
  newErrors.email =
    "Email is required";
  isValid = false;
} else if (
  ! /^\S+@\S+\.\S+$/.test(email)
) {
  newErrors.email =
    "Please enter a valid email address";
  isValid = false;
}

if (!password) {
  newErrors.password =
    "Password is required";
  isValid = false;
} else if (
  password.length < 6
) {
  newErrors.password =
    "Password must be at least 6 characters";
  isValid = false;
}

if (!confirmPassword) {
  newErrors.confirmPassword =
    "Please confirm your password";
  isValid = false;
} else if (
  password !== confirmPassword
) {
  newErrors.confirmPassword =
    "Passwords do not match";
  isValid = false;
}

setErrors(newErrors);
return isValid;

}

async function handleRegister(
e: React.FormEvent
) {
e.preventDefault();

if (!validate()) return;

try {
  setLoading(true);

  await register({
    name: name.trim(),
    email: email.trim(),
    password,
  });

  const auth = await login(
    email.trim(),
    password
  );

  await authLogin(
    auth.access_token
  );

  showToast(
    "Account created successfully!",
    "success"
  );

  setTimeout(() => {
    navigate("/dashboard");
  }, 800);
} catch (error: any) {
  const message =
    error.response?.data?.detail ||
    "Registration failed";

  showToast(message, "error");
} finally {
  setLoading(false);
}

}

return ( <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
{toast.visible && ( <div className="fixed top-6 right-6 z-50"> <Toast
         message={toast.message}
         type={toast.type}
       /> </div>
)}

  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Create account
      </h1>
      <p className="text-gray-600 mt-2">
        Start tracking your expenses today
      </p>
    </div>

    <form
      onSubmit={handleRegister}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your full name"
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Create a password"
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm your password"
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Creating account..."
          : "Create account"}
      </button>
    </form>

    <p className="text-center text-sm text-gray-600 mt-6">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-blue-600 hover:underline font-medium"
      >
        Sign in
      </Link>
    </p>
  </div>
</div>

);
}

export default RegisterPage;
