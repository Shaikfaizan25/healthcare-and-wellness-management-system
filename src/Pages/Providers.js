import React, { useState, useEffect } from "react";
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from "../services/Api";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",          // Add password field here
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const res = await getProviders();
    setProviders(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editId) {
        await updateProvider(editId, form);
        setEditId(null);
      } else {
        await createProvider(form);
      }
      setForm({ name: "", email: "", phone: "", specialization: "", password: "" });
      fetchProviders();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
        console.error("Backend validation error:", err.response.data);
      } else {
        setError("Submission failed. Please try again.");
        console.error(err);
      }
    }
  };

  const handleEdit = (provider) => {
    setEditId(provider.id);
    setForm({
      name: provider.name || "",
      email: provider.email || "",
      phone: provider.phone || "",
      specialization: provider.specialization || "",
      password: "",       // Do not prefill password for security reasons
    });
  };

  const handleDelete = async (id) => {
    await deleteProvider(id);
    fetchProviders();
  };

  return (
    <div>
      <h2>Providers</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={form.specialization}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required={!editId}  // Password required only when creating
        />
        <button type="submit">{editId ? "Update" : "Create"}</button>
      </form>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          Error: {JSON.stringify(error)}
        </div>
      )}

      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Specialization</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>
              <td>{p.specialization}</td>
              <td>
                <button type="button" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Providers;
