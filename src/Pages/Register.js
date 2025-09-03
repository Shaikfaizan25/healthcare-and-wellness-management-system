import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/Api"; // your API register function

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PATIENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="row justify-content-center my-5">
  <div className="col-md-6">
    <div
      className="card shadow-lg p-4 border-0"
      style={{
        borderRadius: "18px",
        background: "linear-gradient(145deg, #1a1a1a, #2c2c2c)",
        color: "#f9f9f9",
        boxShadow: "0 8px 25px rgba(255, 215, 0, 0.2)",
      }}
    >
      <h3
        className="mb-4 text-center fw-bold"
        style={{
          color: "#ffd700",
          textShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
        }}
      >
        Register
      </h3>

      {error && (
        <div className="alert text-center" style={{ color: "#ff6b6b" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="name"
            className="form-label fw-semibold"
            style={{ color: "#ffd700" }}
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            style={{
              borderRadius: "10px",
              border: "1.5px solid rgba(255, 215, 0, 0.4)",
              backgroundColor: "#222",
              color: "#fff",
            }}
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="email"
            className="form-label fw-semibold"
            style={{ color: "#ffd700" }}
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            style={{
              borderRadius: "10px",
              border: "1.5px solid rgba(255, 215, 0, 0.4)",
              backgroundColor: "#222",
              color: "#fff",
            }}
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="password"
            className="form-label fw-semibold"
            style={{ color: "#ffd700" }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            style={{
              borderRadius: "10px",
              border: "1.5px solid rgba(255, 215, 0, 0.4)",
              backgroundColor: "#222",
              color: "#fff",
            }}
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Choose a strong password"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="form-label fw-semibold"
            style={{ color: "#ffd700" }}
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            className="form-select"
            style={{
              borderRadius: "10px",
              border: "1.5px solid rgba(255, 215, 0, 0.4)",
              backgroundColor: "#222",
              color: "#fff",
            }}
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="WELLNESS_PROVIDER">Wellness Provider</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn w-100 fw-bold"
          style={{
            background: "linear-gradient(90deg, #ffd700, #d4af37)",
            border: "none",
            borderRadius: "10px",
            padding: "12px 0",
            fontSize: "1.1rem",
            color: "#111",
            boxShadow: "0 6px 14px rgba(255, 215, 0, 0.3)",
            transition: "all 0.3s ease",
          }}
          disabled={loading}
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #e6c200, #b7950b)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #ffd700, #d4af37)")
          }
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  </div>
</div>
  )
};

export default Register;
