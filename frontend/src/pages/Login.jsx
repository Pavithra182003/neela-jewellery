import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login/", form);

      login(
      res.data.user,
      res.data.access,
      res.data.refresh
    );

    toast.success("Login Successful");

      navigate("/");
    } catch (err) {
  console.log("Login Error:", err.response?.data);

  const data = err.response?.data;

  if (data) {
    Object.entries(data).forEach(([field, value]) => {
      toast.error(
        Array.isArray(value)
          ? value[0]
          : value
      );
    });
  } else {
    toast.error("Login Failed");
  }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-6">

      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to your Neela Jewellery account
        </p>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg p-3"
              placeholder="Enter Email"
              required
            />

          </div>

          <div className="mb-6">

            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg p-3"
              placeholder="Enter Password"
              required
            />

          </div>

          <button
            className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Please Wait..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-yellow-700 font-semibold ml-2"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}