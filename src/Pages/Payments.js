import React, { useEffect, useState } from "react";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getAllPatients,
  getAppointments,
  getWellnessServices,
} from "../services/Api";


  const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "2rem",
    color: "#f9f9f9",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    background: "rgba(0, 0, 0, 0.65)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 8px 32px rgba(255, 215, 0, 0.25)",
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 24,
    borderBottom: "3px solid #ffd700",
    paddingBottom: 8,
    color: "#ffd700",
    textShadow: "0 0 6px rgba(255, 215, 0, 0.5)",
  },
  alert: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontWeight: 600,
  },
  alertError: {
    background: "#4d1a1a",
    color: "#ff6b6b",
  },
  alertSuccess: {
    background: "#333300",
    color: "#ffd700",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 32,
  },
  formFullWidth: {
    gridColumn: "1 / -1",
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: 6,
    color: "#ffd700",
  },
  select: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid rgba(255, 215, 0, 0.4)",
    outline: "none",
    backgroundColor: "rgba(34,34,34,0.7)",
    color: "#f9f9f9",
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid rgba(255, 215, 0, 0.4)",
    outline: "none",
    backgroundColor: "rgba(34,34,34,0.7)",
    color: "#f9f9f9",
  },
  button: {
    gridColumn: "1 / -1",
    padding: "14px 0",
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 20,
    border: "none",
    background: "linear-gradient(90deg, #ffd700 5%, #d4af37 95%)",
    color: "#111",
    cursor: "pointer",
    boxShadow: "0 8px 30px rgba(255, 215, 0, 0.5)",
    transition: "background 0.3s ease",
  },
  buttonDisabled: {
    background: "rgba(255, 215, 0, 0.3)",
    cursor: "not-allowed",
  },
  tableContainer: {
    background: "rgba(34,34,34,0.65)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 8px 32px rgba(255, 215, 0, 0.25)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 14px",
    fontSize: 15,
    color: "#f9f9f9",
  },
  thead: {
    background: "linear-gradient(135deg, #ffd700, #d4af37)",
    color: "#111",
  },
  th: {
    padding: "14px 20px",
    fontWeight: 600,
    textAlign: "left",
  },
  tbodyTr: {
    background: "rgba(0,0,0,0.7)",
    borderRadius: 15,
    boxShadow: "0 3px 12px rgba(255, 215, 0, 0.15)",
  },
  td: {
    padding: "14px 20px",
    verticalAlign: "middle",
    color: "#f9f9f9",
  },
  actions: {
    display: "flex",
    gap: 12,
  },
  btn: {
    padding: "8px 16px",
    borderRadius: 20,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    color: "#111",
  },
  btnEdit: {
    backgroundColor: "#ffd700",
  },
  btnEditHover: {
    backgroundColor: "#e6c200",
  },
  btnDelete: {
    backgroundColor: "#e53935",
  },
  btnDeleteHover: {
    backgroundColor: "#c62828",
  },
};

const PaymentsCRUD = () => {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    id: null,
    patientId: "",
    appointmentId: "",
    serviceId: "",
    paymentStatus: "PENDING",
    paymentDate: "",
    transactionId: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    fetchDropdownData();
    fetchPayments();
  }, []);

  async function fetchDropdownData() {
    try {
      const [patientsData, appointmentsData, servicesData] = await Promise.all([
        getAllPatients(),
        getAppointments(),
        getWellnessServices(),
      ]);
      setPatients(patientsData.data);
      setAppointments(appointmentsData.data);
      setServices(servicesData.data);
    } catch {
      setError("Failed to fetch dropdown data");
    }
  }

  async function fetchPayments() {
    setLoadingPayments(true);
    try {
      const res = await getPayments();
      setPayments(res.data);
    } catch {
      setError("Failed to fetch payments");
    } finally {
      setLoadingPayments(false);
    }
  }

  function clearForm() {
    setForm({
      id: null,
      patientId: "",
      appointmentId: "",
      serviceId: "",
      paymentStatus: "PENDING",
      paymentDate: "",
      transactionId: "",
      amount: "",
    });
    setError("");
    setSuccess("");
  }

  function generateTransactionId() {
    return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.patientId || !form.appointmentId || !form.serviceId || !form.amount) {
      setError("Please fill all required fields");
      return;
    }
    if (form.amount <= 0) {
      setError("Amount must be positive");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const payload = {
      patientId: Number(form.patientId),
      appointmentId: Number(form.appointmentId),
      serviceId: Number(form.serviceId),
      paymentStatus: form.paymentStatus,
      paymentDate: form.paymentDate ? new Date(form.paymentDate) : new Date(),
      transactionId: form.id ? form.transactionId : generateTransactionId(),
      amount: Number(form.amount),
    };
    try {
      if (form.id) {
        await updatePayment(form.id, payload);
        setSuccess("Payment updated");
      } else {
        await createPayment(payload);
        setSuccess("Payment created");
      }
      clearForm();
      fetchPayments();
    } catch {
      setError("Failed to save payment");
    }
    setLoading(false);
  }

  function handleEdit(payment) {
    setForm({
      id: payment.id,
      patientId: payment.patient?.id || payment.patientId || "",
      appointmentId: payment.appointment?.id || payment.appointmentId || "",
      serviceId: payment.service?.id || payment.serviceId || "",
      paymentStatus: payment.paymentStatus || "PENDING",
      paymentDate: payment.paymentDate ? payment.paymentDate.substring(0, 16) : "",
      transactionId: payment.transactionId,
      amount: payment.amount,
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    setLoading(true);
    try {
      await deletePayment(id);
      if(form.id === id) clearForm();
      setSuccess("Payment deleted");
      fetchPayments();
    } catch {
      setError("Failed to delete payment");
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Payments Management</h1>

        {error && <div style={{ ...styles.alert, ...{ background: '#fdecea', color: '#d32f2f' } }}>{error}</div>}
        {success && <div style={{ ...styles.alert, ...{ background: '#eafaf1', color: '#388e3c' } }}>{success}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={styles.label}>Patient</label>
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={styles.label}>Appointment</label>
            <select
              name="appointmentId"
              value={form.appointmentId}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Appointment</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.appointmentDate} - {a.status}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={styles.label}>Service</label>
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={styles.label}>Payment Status</label>
            <select
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={styles.label}>Payment Date</label>
            <input
              type="datetime-local"
              name="paymentDate"
              value={form.paymentDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "1rem" }}>
            <label style={styles.label}>
              Transaction ID: <strong>{form.id ? form.transactionId : "Will be generated"}</strong>
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={styles.label}>Amount</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            disabled={loading}
          >
            {loading ? (form.id ? "Updating..." : "Creating...") : form.id ? "Update Payment" : "Create Payment"}
          </button>

          {form.id && (
            <button
              type="button"
              onClick={clearForm}
              style={{ backgroundColor: "#6c757d", color: "white", padding: "12px", marginTop: "12px", borderRadius: "20px", border: "none", cursor: "pointer" }}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </form>

        <h2 style={{ marginTop: 40, marginBottom: 20, fontWeight: 600 }}>Payment Records</h2>

        {loadingPayments ? (
          <p>Loading payments...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : payments.length === 0 ? (
          <p>No payment records found.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Appointment</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Transaction ID</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              {/* <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} style={{ backgroundColor: "#f8fafd", borderRadius: 15, boxShadow: "0 3px 12px rgba(31, 38, 135, 0.15)", marginBottom: 10 }}>
                    <td style={styles.td}>{payment.id}</td>
                    <td style={styles.td}>{payment.patient?.name || payment.patientId || "N/A"}</td>
                    <td style={styles.td}>{payment.appointment?.appointmentDate || payment.appointmentId || "N/A"}</td>
                    <td style={styles.td}>{payment.service?.name || payment.serviceId || "N/A"}</td>
                    <td style={styles.td}>{payment.paymentStatus}</td>
                    <td style={styles.td}>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "-"}</td>
                    <td style={styles.td}>{payment.transactionId}</td>
                    <td style={styles.td}>{payment.amount != null ? payment.amount.toFixed(2) : "-"}</td>
                    <td style={{ ...styles.td, ...styles.actions }}>
                      <button
                        onClick={() => handleEdit(payment)}
                        style={styles.btnEdit}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this payment?")) {
                            handleDelete(payment.id);
                          }
                        }}
                        style={styles.btnDelete}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody> */}
              <tbody>
    {payments.map(payment => (
      <tr key={payment.id}>
        <td>{payment.id}</td>
        <td>{payment.patient?.name || payment.patientId || "N/A"}</td>
        <td>
          {payment.appointment?.appointmentDate
            ? new Date(payment.appointment.appointmentDate).toLocaleString()
            : payment.appointmentId || "N/A"}
        </td>
        <td>{payment.service?.name || payment.serviceId || "N/A"}</td>
        <td>
          <span
            className={`badge ${
              payment.paymentStatus === "PAID"
                ? "bg-success"
                : payment.paymentStatus === "PENDING"
                ? "bg-warning text-dark"
                : "bg-danger"
            }`}
          >
            {payment.paymentStatus}
          </span>
        </td>
        <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "-"}</td>
        <td>{payment.transactionId}</td>
        <td>{payment.amount != null ? payment.amount.toFixed(2) : "-"}</td>
        <td>
          <div className="d-flex gap-2">
            <button
              onClick={() => handleEdit(payment)}
              className="btn btn-sm btn-primary"
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this payment?")) {
                  handleDelete(payment.id);
                }
              }}
              className="btn btn-sm btn-danger"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentsCRUD;
