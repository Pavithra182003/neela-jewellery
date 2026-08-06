import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const names = form.full_name.trim().split(" ");

        await API.post("/auth/register/", {
          username: form.email,
          email: form.email,
          first_name: names[0] || "",
          last_name: names.slice(1).join(" "),
          phone_number: form.phone,
          password: form.password,
          password2: form.confirm_password,
        });
        
      toast.success("Registration Successful");

      navigate("/login");
    } catch (err) {
      console.log("Register Error:", err.response?.data);

      const data = err.response?.data;

      if (data) {
        Object.entries(data).forEach(([field, value]) => {
          toast.error(
            Array.isArray(value)
              ? `${field}: ${value[0]}`
              : `${field}: ${value}`
          );
        });
      } else {
        toast.error("Registration Failed");
      }
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Join Neela Jewellery today
        </p>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="font-medium">Full Name</label>

            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter Full Name"
              className="w-full mt-2 border rounded-lg p-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full mt-2 border rounded-lg p-3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="font-medium">Phone Number</label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className="w-full mt-2 border rounded-lg p-3"
            />
          </div>

          <div className="mb-4">
            <label className="font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full mt-2 border rounded-lg p-3"
              required
            />
          </div>

          <div className="mb-6">
            <label className="font-medium">Confirm Password</label>

            <input
              type="password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full mt-2 border rounded-lg p-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-700 hover:bg-yellow-800 text-white rounded-lg py-3 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center mt-6">
          Already have an account?

          <Link
            to="/login"
            className="text-yellow-700 font-semibold ml-2"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}