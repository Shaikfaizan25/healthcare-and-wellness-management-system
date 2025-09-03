import React, { useEffect, useState } from "react";
import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getAllPatients,
  getWellnessServices, // updated here
} from "../services/Api";

const EnrollmentsCRUD = () => {
  const enrollmentStyles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "2rem",
    background: "rgba(0,0,0,0.65)",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(255, 215, 0, 0.25)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#f9f9f9",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    borderBottom: "3px solid #ffd700",
    paddingBottom: "0.5rem",
    color: "#ffd700",
    textShadow: "0 0 6px rgba(255, 215, 0, 0.5)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  label: {
    fontWeight: 600,
    marginBottom: "0.4rem",
    color: "#ffd700",
  },
  select: {
    padding: "10px",
    borderRadius: "10px",
    border: "1.5px solid rgba(255,215,0,0.5)",
    background: "rgba(34,34,34,0.7)",
    color: "#f9f9f9",
    outline: "none",
  },
  input: {
    padding: "10px",
    borderRadius: "10px",
    border: "1.5px solid rgba(255,215,0,0.5)",
    background: "rgba(34,34,34,0.7)",
    color: "#f9f9f9",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    background: "linear-gradient(135deg, #ffd700 0%, #d4af37 100%)",
    color: "#111",
    boxShadow: "0 6px 18px rgba(255,215,0,0.5)",
    transition: "all 0.3s ease",
    marginTop: "0.5rem",
  },
  buttonHover: {
    background: "linear-gradient(135deg, #e6c200 0%, #b7950b 100%)",
  },
  cancelButton: {
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    background: "rgba(255,255,255,0.15)",
    color: "#ffd700",
    border: "2px solid rgba(255,215,0,0.5)",
    boxShadow: "0 4px 15px rgba(255,215,0,0.2)",
    transition: "all 0.3s ease",
    marginTop: "0.5rem",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "20px",
    background: "rgba(34,34,34,0.65)",
    padding: "1rem",
    boxShadow: "0 8px 24px rgba(255, 215, 0, 0.25)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
    fontSize: "1rem",
    color: "#f9f9f9",
  },
  th: {
    background: "linear-gradient(135deg, #ffd700, #d4af37)",
    color: "#111",
    padding: "12px 18px",
    textAlign: "left",
    borderRadius: "8px",
  },
  td: {
    padding: "12px 18px",
    verticalAlign: "middle",
    background: "rgba(255, 215, 0, 0.1)",
    borderRadius: "8px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  editBtn: {
    padding: "8px 14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    backgroundColor: "#ffd700",
    color: "#111",
    boxShadow: "0 4px 12px rgba(255,215,0,0.6)",
  },
  editBtnHover: {
    backgroundColor: "#e6c200",
    boxShadow: "0 6px 18px rgba(230,194,0,0.7)",
  },
  deleteBtn: {
    padding: "8px 14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    backgroundColor: "#e53935",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(229,57,53,0.6)",
  },
  deleteBtnHover: {
    backgroundColor: "#c62828",
    boxShadow: "0 6px 18px rgba(198,40,40,0.7)",
  },
};

  // Data state
  const [enrollments, setEnrollments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);
  // Form state
  const [form, setForm] = useState({
    id: null,
    patientId: "",
    serviceId: "",
    startDate: "",
    endDate: "",
    progress: 0,
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingEnrollments(true);
      try {
        const [enrRes, patRes, serRes] = await Promise.all([
          getEnrollments(),
          getAllPatients(),
          getWellnessServices(), // updated here
        ]);
        setEnrollments(enrRes.data);
        setPatients(patRes.data);
        setServices(serRes.data);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      } finally {
        setLoadingEnrollments(false);
      }
    };
    fetchInitialData();
  }, []);

  const clearForm = () => {
    setForm({
      id: null,
      patientId: "",
      serviceId: "",
      startDate: "",
      endDate: "",
      progress: 0,
    });
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        patientId: Number(form.patientId),
        serviceId: Number(form.serviceId),
        startDate: form.startDate,
        endDate: form.endDate,
        progress: form.progress,
      };

      if (form.id) {
        await updateEnrollment(form.id, payload);
        setSuccess("Enrollment updated successfully!");
      } else {
        await createEnrollment(payload);
        setSuccess("Enrollment created successfully!");
      }

      clearForm();
      // Refresh enrollments list
      const res = await getEnrollments();
      setEnrollments(res.data);
    } catch (err) {
      setError("Failed to save enrollment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (enroll) => {
    setForm({
      id: enroll.id,
      patientId: enroll.patientId || "",
      serviceId: enroll.serviceId || "",
      startDate: enroll.startDate || "",
      endDate: enroll.endDate || "",
      progress: enroll.progress || 0,
    });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this enrollment?")) return;
    setLoading(true);
    try {
      await deleteEnrollment(id);
      setSuccess("Enrollment deleted.");
      if (form.id === id) clearForm();
      const res = await getEnrollments();
      setEnrollments(res.data);
    } catch (err) {
      setError("Failed to delete enrollment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div>
  //     <h2>{form.id ? "Edit Enrollment" : "New Enrollment"}</h2>
  //     <form onSubmit={handleSubmit}>
  //       <label>
  //         Patient:
  //         <select name="patientId" value={form.patientId} onChange={handleChange} required>
  //           <option value="">Select patient</option>
  //           {patients.map((p) => (
  //             <option key={p.id} value={p.id}>
  //               {p.name} ({p.email})
  //             </option>
  //           ))}
  //         </select>
  //       </label>
  //       <br />

  //       <label>
  //         Wellness Service:
  //         <select name="serviceId" value={form.serviceId} onChange={handleChange} required>
  //           <option value="">Select service</option>
  //           {services.map((s) => (
  //             <option key={s.id} value={s.id}>
  //               {s.name}
  //             </option>
  //           ))}
  //         </select>
  //       </label>
  //       <br />

  //       <label>
  //         Start Date:
  //         <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
  //       </label>
  //       <br />

  //       <label>
  //         End Date:
  //         <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
  //       </label>
  //       <br />

  //       <label>
  //         Progress (%):
  //         <input
  //           type="number"
  //           name="progress"
  //           min="0"
  //           max="100"
  //           value={form.progress}
  //           onChange={handleChange}
  //           required
  //         />
  //       </label>
  //       <br />

  //       <button type="submit" disabled={loading}>
  //         {loading ? (form.id ? "Updating..." : "Creating...") : form.id ? "Update Enrollment" : "Create Enrollment"}
  //       </button>
  //       {form.id && <button type="button" onClick={clearForm}>Cancel Edit</button>}
  //     </form>

  //     <hr />

  //     <h3>Enrollments List</h3>
  //     {loadingEnrollments ? (
  //       <p>Loading enrollments...</p>
  //     ) : error ? (
  //       <p style={{ color: "red" }}>{error}</p>
  //     ) : enrollments.length === 0 ? (
  //       <p>No enrollments found.</p>
  //     ) : (
  //       <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
  //         <thead>
  //           <tr>
  //             <th>ID</th>
  //             <th>Patient</th>
  //             <th>Service</th>
  //             <th>Start Date</th>
  //             <th>End Date</th>
  //             <th>Progress</th>
  //             <th>Actions</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {enrollments.map((enroll) => (
  //             <tr key={enroll.id}>
  //               <td>{enroll.id}</td>
  //               <td>{enroll.patient?.name || "Unknown Patient"}</td>
  //               <td>{enroll.service?.name || "Unknown Service"}</td>
  //               <td>{enroll.startDate}</td>
  //               <td>{enroll.endDate}</td>
  //               <td>{enroll.progress} %</td>
  //               <td>
  //                 <button onClick={() => handleEdit(enroll)} disabled={loading}>
  //                   Edit
  //                 </button>{" "}
  //                 <button onClick={() => handleDelete(enroll.id)} disabled={loading}>
  //                   Delete
  //                 </button>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     )}
  //   </div>
  // );
  return (
    <div style={enrollmentStyles.container}>
      <h2 style={enrollmentStyles.heading}>
        {form.id ? "Edit Enrollment" : "New Enrollment"}
      </h2>

      <form style={enrollmentStyles.form} onSubmit={handleSubmit}>
        <div>
          <label style={enrollmentStyles.label}>Patient:</label>
          <select
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            required
            style={enrollmentStyles.select}
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={enrollmentStyles.label}>Wellness Service:</label>
          <select
            name="serviceId"
            value={form.serviceId}
            onChange={handleChange}
            required
            style={enrollmentStyles.select}
          >
            <option value="">Select service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={enrollmentStyles.label}>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            style={enrollmentStyles.input}
          />
        </div>

        <div>
          <label style={enrollmentStyles.label}>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            style={enrollmentStyles.input}
          />
        </div>

        <div>
          <label style={enrollmentStyles.label}>Progress (%):</label>
          <input
            type="number"
            name="progress"
            min="0"
            max="100"
            value={form.progress}
            onChange={handleChange}
            required
            style={enrollmentStyles.input}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...enrollmentStyles.button,
            ...(hoveredButton === "submit" ? enrollmentStyles.buttonHover : {}),
          }}
          onMouseEnter={() => setHoveredButton("submit")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {loading
            ? form.id
              ? "Updating..."
              : "Creating..."
            : form.id
            ? "Update Enrollment"
            : "Create Enrollment"}
        </button>

        {form.id && (
          <button
            type="button"
            onClick={clearForm}
            style={{
              ...enrollmentStyles.cancelButton,
              ...(hoveredButton === "cancel" ? enrollmentStyles.buttonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton("cancel")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <hr style={{ borderColor: "rgba(255,215,0,0.3)" }} />

      <h3 style={enrollmentStyles.heading}>Enrollments List</h3>

      {loadingEnrollments ? (
        <p>Loading enrollments...</p>
      ) : error ? (
        <p style={{ color: "#e53935" }}>{error}</p>
      ) : enrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <div style={enrollmentStyles.tableContainer}>
          <table style={enrollmentStyles.table}>
            <thead>
              <tr>
                <th style={enrollmentStyles.th}>ID</th>
                <th style={enrollmentStyles.th}>Patient</th>
                <th style={enrollmentStyles.th}>Service</th>
                <th style={enrollmentStyles.th}>Start Date</th>
                <th style={enrollmentStyles.th}>End Date</th>
                <th style={enrollmentStyles.th}>Progress</th>
                <th style={enrollmentStyles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enroll) => (
                <tr key={enroll.id} style={enrollmentStyles.tbodyTr}>
                  <td style={enrollmentStyles.td}>{enroll.id}</td>
                  <td style={enrollmentStyles.td}>{enroll.patient?.name || "Unknown Patient"}</td>
                  <td style={enrollmentStyles.td}>{enroll.service?.name || "Unknown Service"}</td>
                  <td style={enrollmentStyles.td}>{enroll.startDate}</td>
                  <td style={enrollmentStyles.td}>{enroll.endDate}</td>
                  <td style={enrollmentStyles.td}>{enroll.progress} %</td>
                  <td style={{ ...enrollmentStyles.td, ...enrollmentStyles.actions }}>
                    <button
                      onClick={() => handleEdit(enroll)}
                      disabled={loading}
                      style={{
                        ...enrollmentStyles.editBtn,
                        ...(hoveredButton === `edit-${enroll.id}` ? enrollmentStyles.editBtnHover : {}),
                      }}
                      onMouseEnter={() => setHoveredButton(`edit-${enroll.id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(enroll.id)}
                      disabled={loading}
                      style={{
                        ...enrollmentStyles.deleteBtn,
                        ...(hoveredButton === `delete-${enroll.id}` ? enrollmentStyles.deleteBtnHover : {}),
                      }}
                      onMouseEnter={() => setHoveredButton(`delete-${enroll.id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
};

export default EnrollmentsCRUD;
