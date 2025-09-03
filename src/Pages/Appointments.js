import React, { useEffect, useState } from "react";
import {
  getAllPatients,
  getProviders,
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../services/Api";
import "bootstrap/dist/css/bootstrap.min.css";

const styles = {
  container: {
    maxWidth: "700px",
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontWeight: "700",
    color: "#ffd700",
    marginBottom: "1rem",
    borderBottom: "3px solid #d4af37",
    paddingBottom: "0.5rem",
  },
  alert: {
    borderRadius: "8px",
    fontWeight: "600",
    color: "#ff6b6b",
  },
  form: {
    backgroundColor: "#1a1a1a",
    padding: "1.5rem 2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(255, 215, 0, 0.15)",
    marginBottom: "1rem",
    color: "#f9f9f9",
  },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#ffd700",
    marginBottom: "0.5rem",
  },
  select: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1.5px solid rgba(255, 215, 0, 0.3)",
    marginBottom: "1rem",
    boxSizing: "border-box",
    color: "#f9f9f9",
    backgroundColor: "#222",
  },
  input: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1.5px solid rgba(255, 215, 0, 0.3)",
    marginBottom: "1rem",
    boxSizing: "border-box",
    color: "#f9f9f9",
    backgroundColor: "#222",
  },
  textarea: {
    width: "100%",
    padding: "10px 15px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1.5px solid rgba(255, 215, 0, 0.3)",
    marginBottom: "1.5rem",
    boxSizing: "border-box",
    resize: "vertical",
    color: "#f9f9f9",
    backgroundColor: "#222",
  },
  button: {
    width: "100%",
    padding: "14px 0",
    fontSize: "1.15rem",
    fontWeight: "700",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(255, 215, 0, 0.48)",
    background: "linear-gradient(90deg, #ffd700 2%, #d4af37 98%)",
    color: "#111",
    transition: "background 0.3s ease",
    marginBottom: "1rem",
  },
  buttonHover: {
    background: "linear-gradient(90deg, #e6c200 2%, #b7950b 98%)",
  },
  buttonDisabled: {
    background: "rgba(255, 215, 0, 0.3)",
    cursor: "not-allowed",
  },
  tableContainer: {
    marginTop: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(255, 215, 0, 0.24)",
    overflowX: "auto",
    backgroundColor: "#1a1a1a",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
    fontSize: "1rem",
    color: "#f9f9f9",
  },
  thead: {
    backgroundColor: "#d4af37",
    color: "#111",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  },
  th: {
    padding: "14px 20px",
    fontWeight: "700",
    textAlign: "left",
  },
  tbodyRow: {
    backgroundColor: "#222",
    borderRadius: "12px",
  },
  td: {
    padding: "14px 20px",
    verticalAlign: "middle",
    color: "#f9f9f9",
  },
  statusSelect: {
    width: "100%",
    padding: "8px 12px",
    fontSize: "0.95rem",
    borderRadius: "8px",
    border: "1.5px solid rgba(255, 215, 0, 0.3)",
    color: "#f9f9f9",
    backgroundColor: "#222",
  },
  actionCell: {
    display: "flex",
    gap: "10px",
  },
  btnAction: {
    padding: "8px 16px",
    fontWeight: "600",
    fontSize: "0.9rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  btnEdit: {
    color: "#ffd700",
    border: "2px solid #ffd700",
    backgroundColor: "transparent",
  },
  btnEditHover: {
    color: "#111",
    backgroundColor: "#ffd700",
    boxShadow: "0 5px 12px rgba(255, 215, 0, 0.7)",
  },
  btnDelete: {
    color: "#e74c3c",
    border: "2px solid #e74c3c",
    backgroundColor: "transparent",
  },
  btnDeleteHover: {
    color: "white",
    backgroundColor: "#e74c3c",
    boxShadow: "0 5px 12px rgba(231, 76, 60, 0.7)",
  },
};


const AppointmentBooking = () => {
  const [patients, setPatients] = React.useState([]);
  const [providers, setProviders] = React.useState([]);
  const [appointments, setAppointments] = React.useState([]);
  const [form, setForm] = React.useState({
    id: null,
    patient_id: "",
    provider_id: "",
    appointment_date: "",
    notes: "",
    status: "PENDING",
  });
  const [loading, setLoading] = React.useState(false);
  const [loadingAppointments, setLoadingAppointments] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [showAppointments, setShowAppointments] = React.useState(false);
  const [hoveredBtn, setHoveredBtn] = React.useState(null);
  const [hoveredAction, setHoveredAction] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, providersRes] = await Promise.all([
          getAllPatients(),
          getProviders(),
        ]);
        setPatients(patientsRes.data);
        setProviders(providersRes.data);
      } catch {
        setError("Failed to load dropdown data.");
      }
    };
    fetchData();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    setError(null);
    try {
      const response = await getAppointments();
      console.log("Fetched appointments:", response);
      setAppointments(response.data);
    } catch {
      setError("Failed to fetch appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({ id: null, patient_id: "", provider_id: "", appointment_date: "", notes: "", status: "PENDING" });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      appointmentDate: form.appointment_date,
      notes: form.notes,
      status: form.status,
      patient: { id: Number(form.patient_id) },
      provider: { id: Number(form.provider_id) }
    };

    try {
      if (form.id) {
        await updateAppointment(form.id, payload);
        setSuccess("Appointment updated successfully.");
      } else {
        await createAppointment(payload);
        setSuccess("Appointment booked successfully.");
      }
      clearForm();
      fetchAppointments();
    } catch {
      setError("Failed to save appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = appt => {
    setForm({
      id: appt.id,
      patient_id: appt.patient?.id || "",
      provider_id: appt.provider?.id || "",
      appointment_date: appt.appointmentDate ? appt.appointmentDate.slice(0, 16) : "",
      notes: appt.notes || "",
      status: appt.status || "PENDING"
    });
    setError(null);
    setSuccess(null);
    setShowAppointments(false);
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    setLoading(true);
    try {
      await deleteAppointment(id);
      setSuccess("Deleted successfully.");
      if (form.id === id) clearForm();
      fetchAppointments();
    } catch {
      setError("Failed to delete appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    try {
      await updateAppointment(id, { status });
      setSuccess("Status updated.");
      setAppointments(appointments.map(appt => appt.id === id ? { ...appt, status } : appt));
    } catch {
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{form.id ? "Edit Appointment" : "Book Appointment"}</h2>

      {error && <div className="alert alert-danger" style={styles.alert}>{error}</div>}
      {success && <div className="alert alert-success" style={styles.alert}>{success}</div>}

      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        <label htmlFor="patient_id" style={styles.label}>Select Patient</label>
        <select id="patient_id" name="patient_id" value={form.patient_id} onChange={handleChange} style={styles.select} required>
          <option value="">-- Select Patient --</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.email})</option>)}
        </select>

        <label htmlFor="provider_id" style={styles.label}>Select Provider</label>
        <select id="provider_id" name="provider_id" value={form.provider_id} onChange={handleChange} style={styles.select} required>
          <option value="">-- Select Provider --</option>
          {providers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.specialization})</option>)}
        </select>

        <label htmlFor="appointment_date" style={styles.label}>Appointment Date & Time</label>
        <input type="datetime-local" id="appointment_date" name="appointment_date" value={form.appointment_date} onChange={handleChange} style={styles.input} required />

        <label htmlFor="status" style={styles.label}>Status</label>
        <select id="status" name="status" value={form.status} onChange={handleChange} style={styles.select} required>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <label htmlFor="notes" style={styles.label}>Notes (Optional)</label>
        <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} style={styles.textarea} rows={3} />

        <button type="submit" style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button} disabled={loading}>
          {loading ? (form.id ? "Updating..." : "Booking...") : (form.id ? "Update Appointment" : "Book Appointment")}
        </button>

        <button
          type="button"
          onClick={() => setShowAppointments(prev => !prev)}
          style={{ ...styles.button, marginTop: '1rem', background: '#3927aeff', boxShadow: '0 6px 20px rgba(39, 174, 96, 0.48)' }}
          onMouseEnter={e => e.currentTarget.style.background = '#3a229aff'}
          onMouseLeave={e => e.currentTarget.style.background = '#4f27aeff'}
        >
          {showAppointments ? "Hide Appointments" : "View Appointments"}
        </button>

        {form.id && (
          <button
            type="button"
            onClick={clearForm}
            style={{ ...styles.button, background: '#6c757d', marginTop: '1rem' }}
            onMouseEnter={e => e.currentTarget.style.background = '#5a6268'}
            onMouseLeave={e => e.currentTarget.style.background = '#6c757d'}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>

      {showAppointments && (
        <div style={styles.tableContainer}>
          <h3 style={{...styles.heading, marginTop: 0}}>Appointments List</h3>
          {loadingAppointments ? <p>Loading appointments...</p> : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : appointments.length === 0 ? <p>No appointments available.</p> : (
            <table style={styles.table} className="table">
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Provider</th>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Notes</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              {/* <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id} style={styles.tbodyRow}>
                    <td style={styles.td}>{appt.patient?.name || "Unknown"}</td>
                    <td style={styles.td}>{appt.provider?.name || "Unknown"}</td>
                    <td style={styles.td}>{new Date(appt.appointmentDate).toLocaleString()}</td>
                    <td style={styles.td}>{appt.notes || "-"}</td>
                    <td style={styles.td}>
                      <select
                        style={styles.statusSelect}
                        value={appt.status}
                        onChange={e => handleStatusChange(appt.id, e.target.value)}
                        disabled={loading}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td style={{...styles.td, ...styles.actionCell}}>
                      <button
                        onClick={() => {
                          handleEdit(appt);
                          setShowAppointments(false);
                        }}
                        style={{...styles.btnAction, ...styles.btnEdit}}
                        onMouseEnter={e => e.currentTarget.style.background = '#f39c12'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        style={{...styles.btnAction, ...styles.btnDelete}}
                        onMouseEnter={e => e.currentTarget.style.background = '#e74c3c'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody> */}
              <tbody>
    {appointments.map(appt => (
      <tr key={appt.id}>
        <td>{appt.patient?.name || "Unknown"}</td>
        <td>{appt.provider?.name || "Unknown"}</td>
        <td>{new Date(appt.appointmentDate).toLocaleString()}</td>
        <td>{appt.notes || "-"}</td>
        <td>
          <select
            className="form-select form-select-sm"
            value={appt.status}
            onChange={e => handleStatusChange(appt.id, e.target.value)}
            disabled={loading}
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </td>
        <td>
          <div className="d-flex gap-2">
            <button
              onClick={() => {
                handleEdit(appt);
                setShowAppointments(false);
              }}
              className="btn btn-sm btn-warning"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(appt.id)}
              className="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;