import React, { useState, useEffect } from "react";
import {
  getWellnessServices,
  createWellnessService,
  updateWellnessService,
  deleteWellnessService,
} from "../services/Api";
import "bootstrap/dist/css/bootstrap.min.css";

const BACKGROUND_IMAGE = "https://thumbs.dreamstime.com/b/medicine-doctor-stethoscope-touching-medical-icons-network-medicine-doctor-stethoscope-touching-icons-medical-network-111489030.jpg";

const outerStyles = {
  minHeight: "100vh",
  minWidth: "100vw",
  background: `url(${BACKGROUND_IMAGE}) no-repeat center center fixed`,
  backgroundSize: "cover",
  position: "fixed",
  inset: 0,
  zIndex: -1,
};

const styles = {
  container: {
    maxWidth: "650px",
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "1.5rem",
    background: "rgba(0, 0, 0, 0.55)",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(255, 215, 0, 0.25)",
    backdropFilter: "blur(7px)",
    WebkitBackdropFilter: "blur(7px)",
    color: "#f9f9f9",
    position: "relative",
    zIndex: 1,
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
    borderBottom: "3px solid #ffd700",
    paddingBottom: "0.5rem",
    color: "#ffd700",
    textShadow: "0 0 6px rgba(255, 215, 0, 0.5)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    background: "rgba(34, 34, 34, 0.7)",
    padding: "1.8rem",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(255, 215, 0, 0.2)",
  },
  input: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "1.5px solid rgba(255, 215, 0, 0.4)",
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#f9f9f9",
    outline: "none",
    background: "rgba(0,0,0,0.4)",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  inputFocus: {
    borderColor: "#ffd700",
    boxShadow: "0 0 10px #ffd700",
  },
  button: {
    padding: "16px",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "1.2rem",
    backgroundImage: "linear-gradient(135deg, #ffd700 0%, #d4af37 100%)",
    color: "#111",
    border: "none",
    cursor: "pointer",
    transition: "background-image 0.3s ease",
    boxShadow: "0 8px 24px rgba(255, 215, 0, 0.5)",
    marginTop: "0.4rem",
  },
  buttonHover: {
    backgroundImage: "linear-gradient(135deg, #e6c200 0%, #b7950b 100%)",
  },
  toggleButton: {
    marginTop: "2rem",
    padding: "12px 28px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "1rem",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    border: "2px solid rgba(255, 215, 0, 0.4)",
    color: "#ffd700",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(255, 215, 0, 0.2)",
    transition: "all 0.3s ease",
    display: "block",
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    userSelect: "none",
  },
  toggleButtonHover: {
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderColor: "rgba(255, 215, 0, 0.7)",
    boxShadow: "0 6px 20px rgba(255, 215, 0, 0.4)",
    color: "#111",
  },
  tableContainer: {
    marginTop: "2rem",
    background: "rgba(34,34,34,0.65)",
    borderRadius: "20px",
    padding: "1.2rem",
    boxShadow: "0 8px 24px rgba(255, 215, 0, 0.25)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    overflowX: "auto",
    border: "1px solid rgba(255, 215, 0, 0.3)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
    fontSize: "1.05rem",
    color: "#f9f9f9",
    minWidth: "700px",
  },
  th: {
    background: "linear-gradient(135deg, #ffd700, #d4af37)",
    color: "#111",
    borderRadius: "10px",
    padding: "14px 20px",
    textAlign: "left",
    userSelect: "none",
    fontWeight: "600",
  },
  td: {
    padding: "14px 20px",
    verticalAlign: "middle",
    background: "rgba(255, 215, 0, 0.1)",
    borderRadius: "14px",
    color: "#f9f9f9",
  },
  actionsCell: {
    display: "flex",
    gap: "10px",
  },
  actionBtn: {
    padding: "10px 16px",
    borderRadius: "14px",
    fontWeight: "600",
    fontSize: "0.95rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    backgroundColor: "#ffd700",
    color: "#111",
    boxShadow: "0 4px 12px rgba(255, 215, 0, 0.6)",
  },
  actionBtnHover: {
    backgroundColor: "#e6c200",
    boxShadow: "0 6px 18px rgba(230, 194, 0, 0.7)",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(231, 76, 60, 0.6)",
  },
  deleteBtnHover: {
    backgroundColor: "#c62828",
    boxShadow: "0 6px 18px rgba(198, 40, 40, 0.7)",
  },
};


const WellnessServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    duration: "",
    fee: "",
  });
  const [editId, setEditId] = useState(null);
  const [btnHover, setBtnHover] = useState("");
  const [toggleBtnHover, setToggleBtnHover] = useState(false);
  const [inputFocused, setInputFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showServices, setShowServices] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setError("");
    try {
      const response = await getWellnessServices();
      setServices(response.data);
    } catch {
      setError("Failed to load services.");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.serviceName || !form.description || !form.duration || !form.fee) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const payload = {
      name: form.serviceName,
      description: form.description,
      duration: form.duration,
      fee: form.fee,
    };
    try {
      if (editId) {
        await updateWellnessService(editId, payload);
        setSuccess("Service updated successfully.");
        setEditId(null);
      } else {
        await createWellnessService(payload);
        setSuccess("Service created successfully.");
      }
      setForm({ serviceName: "", description: "", duration: "", fee: "" });
      fetchServices();
    } catch {
      setError("Failed to save service.");
    }
    setLoading(false);
  }

  function handleEdit(service) {
    setEditId(service.id);
    setForm({
      serviceName: service.name || "",
      description: service.description || "",
      duration: service.duration || "",
      fee: service.fee || "",
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await deleteWellnessService(id);
      if (editId === id) setEditId(null);
      setSuccess("Service deleted successfully.");
      fetchServices();
    } catch {
      setError("Failed to delete service.");
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={outerStyles}></div>
      <div style={styles.container}>
        <h2 style={styles.heading}>Wellness Services</h2>
        {error && <div style={{ color: "#e53935", marginBottom: "1rem" }}>{error}</div>}
        {success && <div style={{ color: "#388e3c", marginBottom: "1rem" }}>{success}</div>}
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="serviceName"
            placeholder="Service Name"
            value={form.serviceName}
            onChange={handleChange}
            onFocus={() => setInputFocused("serviceName")}
            onBlur={() => setInputFocused("")}
            style={{
              ...styles.input,
              ...(inputFocused === "serviceName" ? styles.inputFocus : {}),
            }}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            onFocus={() => setInputFocused("description")}
            onBlur={() => setInputFocused("")}
            style={{
              ...styles.input,
              ...(inputFocused === "description" ? styles.inputFocus : {}),
            }}
            required
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 5 days, 2 weeks)"
            value={form.duration}
            onChange={handleChange}
            onFocus={() => setInputFocused("duration")}
            onBlur={() => setInputFocused("")}
            style={{
              ...styles.input,
              ...(inputFocused === "duration" ? styles.inputFocus : {}),
            }}
            required
          />
          <input
            type="number"
            step="0.01"
            name="fee"
            placeholder="Fee (e.g., 100.00)"
            value={form.fee}
            onChange={handleChange}
            onFocus={() => setInputFocused("fee")}
            onBlur={() => setInputFocused("")}
            style={{
              ...styles.input,
              ...(inputFocused === "fee" ? styles.inputFocus : {}),
            }}
            required
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(btnHover === "submit" ? styles.buttonHover : {}),
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
            onMouseEnter={() => setBtnHover("submit")}
            onMouseLeave={() => setBtnHover("")}
          >
            {editId ? "Update Service" : "Create Service"}
          </button>
        </form>

        {/* Toggle Button to show/hide services list */}
       <button
  type="button"
  style={{
    ...styles.toggleButton,
    ...(toggleBtnHover ? styles.toggleButtonHover : {}),
  }}
  onClick={() => setShowServices((prev) => !prev)}
  onMouseEnter={() => setToggleBtnHover(true)}
  onMouseLeave={() => setToggleBtnHover(false)}
  aria-expanded={showServices}
  aria-label={showServices ? "Hide Services" : "View Services"}
>
  {showServices ? "Hide Services ▲" : "View Services ▼"}
</button>


        {showServices && (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Service Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Fee</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                      No wellness services found.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr
                      key={service.id}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.6)",
                        borderRadius: "15px",
                        marginBottom: "8px",
                      }}
                    >
                      <td style={styles.td}>{service.id}</td>
                      <td style={styles.td}>{service.name}</td>
                      <td style={styles.td}>{service.description}</td>
                      <td style={styles.td}>{service.duration}</td>
                      <td style={styles.td}>{service.fee}</td>
                      <td style={{ ...styles.td, ...styles.actionsCell }}>
                        <button
                          onClick={() => handleEdit(service)}
                          disabled={loading}
                          style={{
                            ...styles.actionBtn,
                            backgroundColor: "#fbc02d",
                            color: "#0e2f3f",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9a825")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fbc02d")}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          disabled={loading}
                          style={{
                            ...styles.actionBtn,
                            ...styles.deleteBtn,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e53935")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e74c3c")}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessServices;
