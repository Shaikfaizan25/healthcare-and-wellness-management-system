import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/Api"; // import your API login function
import { useAuth } from "../context/AuthContext"; // your auth context

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      const token = res.data.token;

      if (!token) throw new Error("No token received");

      localStorage.setItem("hc_token", token);

      // Optional: fetch user profile, if you have this endpoint
      // const me = await api.get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
      // const user = me.data;

      // Save user and token in AuthContext
      login({ token, user: null });

      navigate("/");
    } catch (err) {
      setError("Login failed. Please check your email and password.");
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
        Login
      </h3>

      {error && (
        <div className="alert text-center" style={{ color: "#ff6b6b" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="email"
            className="form-label fw-semibold"
            style={{ color: "#ffd700" }}
          >
            Email address
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
            placeholder="Enter your password"
          />
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  </div>
</div>
  );
};

export default Login;
